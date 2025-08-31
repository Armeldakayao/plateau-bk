/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ServiceRequest } from './entities/service-request.entity';
// import { CreateServiceRequestDto } from './dto/create-service-request.dto';

// import { NotificationsService } from '../notifications/notifications.service';
// import { UpdateServiceRequestDto } from './dto/update-service-request.dto';

// @Injectable()
// export class ServiceRequestsService {
//   constructor(
//     @InjectRepository(ServiceRequest)
//     private serviceRequestRepository: Repository<ServiceRequest>,
//     private notificationsService: NotificationsService,
//   ) {}

//   // eslint-disable-next-line prettier/prettier
//   async create(createServiceRequestDto: CreateServiceRequestDto, userId: string) {
//     const serviceRequest = this.serviceRequestRepository.create({
//       ...createServiceRequestDto,
//       userId,
//     });

//     const savedRequest = await this.serviceRequestRepository.save(serviceRequest);

//     // Créer une notification pour l'utilisateur
//     await this.notificationsService.create({
//       userId,
//       message: `Votre demande de service "${createServiceRequestDto.type}" a été soumise`,
//       type: 'info',
//     });

//     return savedRequest;
//   }

//   async findAll(page: number = 1, limit: number = 10, status?: string) {
//     const queryBuilder = this.serviceRequestRepository
//       .createQueryBuilder('request')
//       .leftJoinAndSelect('request.user', 'user')
//       .leftJoinAndSelect('request.service', 'service');

//     if (status) {
//       queryBuilder.where('request.status = :status', { status });
//     }

//     queryBuilder.orderBy('request.createdAt', 'DESC');

//     const [requests, total] = await queryBuilder
//       .skip((page - 1) * limit)
//       .take(limit)
//       .getManyAndCount();

//     return {
//       data: requests,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }

//   async findByUser(userId: string, page: number = 1, limit: number = 10) {
//     const [requests, total] = await this.serviceRequestRepository.findAndCount({
//       where: { userId },
//       relations: ['service'],
//       skip: (page - 1) * limit,
//       take: limit,
//       order: { createdAt: 'DESC' },
//     });

//     return {
//       data: requests,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }

//   async findOne(id: string, userId?: string) {
//     const request = await this.serviceRequestRepository.findOne({
//       where: { id },
//       relations: ['user', 'service'],
//     });

//     if (!request) {
//       throw new NotFoundException('Demande non trouvée');
//     }

//     // Vérifier que l'utilisateur peut accéder à cette demande
//     if (userId && request.userId !== userId) {
//       throw new ForbiddenException('Accès non autorisé à cette demande');
//     }

//     return request;
//   }

//   async update(id: string, updateServiceRequestDto: UpdateServiceRequestDto) {
//     const request = await this.findOne(id);
//     const oldStatus = request.status;

//     Object.assign(request, updateServiceRequestDto);
//     const updatedRequest = await this.serviceRequestRepository.save(request);

//     // Notifier l'utilisateur si le statut a changé
//     if (oldStatus !== request.status) {
//       await this.notificationsService.create({
//         userId: request.userId,
//         message: `Le statut de votre demande "${request.type}" a été mis à jour : ${request.status}`,
//         type: 'info',
//       });
//     }

//     return updatedRequest;
//   }

//   async remove(id: string) {
//     const request = await this.findOne(id);
//     return this.serviceRequestRepository.remove(request);
//   }

//   async updateStatus(id: string, status: string, adminNotes?: string) {
//     //@ts-ignore
//     return this.update(id, { status, adminNotes });
//   }
// }
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { ServiceRequest, DemandeEtat } from './entities/service-request.entity';
import { Treatment, TraitementEtat, TraitementResultat } from './entities/treatment.entity';
import { Service } from '../services/entities/service.entity';
import { ServiceRequestDocument } from './entities/service-request-document.entity';
import { TreatmentDocument } from './entities/treatment-document.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../common/services/email.service';
import { CreateRdvRequestDto } from './dto/create-rdv-request.dto';
import { CreatePartenariatRequestDto } from './dto/create-partnariat-request.dto';
import { CreateMariageRequestDto } from './dto/create-mariage-request.dto';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';


@Injectable()
export class ServiceRequestsService {
  constructor(
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
    @InjectRepository(Treatment)
    private treatmentRepository: Repository<Treatment>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(ServiceRequestDocument)
    private documentRepository: Repository<ServiceRequestDocument>,
    @InjectRepository(TreatmentDocument)
    private treatmentDocumentRepository: Repository<TreatmentDocument>,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
  ) {}

  // ==================== CRÉATION DES DEMANDES ====================

  // async createRdvRequest(createRdvRequestDto: CreateRdvRequestDto, userId: string) {
  //   const service = await this.getServiceByType('rdv');
  //   const numeroReference = await this.generateReferenceNumber('RDV');

  //   const serviceRequest = this.serviceRequestRepository.create({
  //     type: 'rdv',
  //     etat: DemandeEtat.EN_ATTENTE,
  //     nom: createRdvRequestDto.nom,
  //     prenom: createRdvRequestDto.prenom,
  //     email: createRdvRequestDto.email,
  //     telephone: createRdvRequestDto.telephone,
  //     demande: createRdvRequestDto,
  //     numeroReference,
  //     utilisateur_id: userId,
  //     service_id: service.id,
  //     priorite: this.calculatePriority('rdv', createRdvRequestDto),
  //     dateLimiteTraitement: this.calculateProcessingDeadline('rdv'),
  //   });

  //   const savedRequest = await this.serviceRequestRepository.save(serviceRequest);
    
  //   // Créer une notification
  //   await this.notificationsService.create({
  //     userId,
  //     message: `Votre demande de rendez-vous (${numeroReference}) a été soumise`,
  //     type: 'info',
  //     serviceRequestId: savedRequest.id,
  //   });

  //   // Envoyer email de confirmation
  //   await this.emailService.sendRequestConfirmation(
  //     createRdvRequestDto.email,
  //     'rdv',
  //     numeroReference
  //   );

  //   return savedRequest;
  // }

  // async createPartenariatRequest(createPartenariatRequestDto: CreatePartenariatRequestDto, userId: string) {
  //   const service = await this.getServiceByType('partenariat');
  //   const numeroReference = await this.generateReferenceNumber('PAR');

  //   const serviceRequest = this.serviceRequestRepository.create({
  //     type: 'partenariat',
  //     etat: DemandeEtat.EN_ATTENTE,
  //     nom: createPartenariatRequestDto.nom,
  //     prenom: createPartenariatRequestDto.prenom,
  //     email: createPartenariatRequestDto.email,
  //     demande: createPartenariatRequestDto,
  //     numeroReference,
  //     utilisateur_id: userId,
  //     service_id: service.id,
  //     priorite: this.calculatePriority('partenariat', createPartenariatRequestDto),
  //     dateLimiteTraitement: this.calculateProcessingDeadline('partenariat'),
  //   });

  //   const savedRequest = await this.serviceRequestRepository.save(serviceRequest);
    
  //   await this.notificationsService.create({
  //     userId,
  //     message: `Votre demande de partenariat (${numeroReference}) a été soumise`,
  //     type: 'info',
  //     serviceRequestId: savedRequest.id,
  //   });

  //   await this.emailService.sendRequestConfirmation(
  //     createPartenariatRequestDto.email,
  //     'partenariat',
  //     numeroReference
  //   );

  //   return savedRequest;
  // }

  // async createMariageRequest(createMariageRequestDto: CreateMariageRequestDto, userId: string) {
  //   const service = await this.getServiceByType('mariage');
  //   const numeroReference = await this.generateReferenceNumber('MAR');

  //   const serviceRequest = this.serviceRequestRepository.create({
  //     type: 'mariage',
  //     etat: DemandeEtat.EN_ATTENTE,
  //     nom: createMariageRequestDto.conjoint1.nom,
  //     prenom: createMariageRequestDto.conjoint1.prenom,
  //     email: createMariageRequestDto.conjoint1.email,
  //     telephone: createMariageRequestDto.conjoint1.phone,
  //     demande: createMariageRequestDto,
  //     numeroReference,
  //     utilisateur_id: userId,
  //     service_id: service.id,
  //     priorite: this.calculatePriority('mariage', createMariageRequestDto),
  //     dateLimiteTraitement: this.calculateProcessingDeadline('mariage'),
  //   });

  //   const savedRequest = await this.serviceRequestRepository.save(serviceRequest);
    
  //   await this.notificationsService.create({
  //     userId,
  //     message: `Votre demande de mariage (${numeroReference}) a été soumise`,
  //     type: 'info',
  //     serviceRequestId: savedRequest.id,
  //   });

  //   await this.emailService.sendRequestConfirmation(
  //     createMariageRequestDto.conjoint1.email,
  //     'mariage',
  //     numeroReference
  //   );

  //   return savedRequest;
  // }
async createRdvRequest(createRdvRequestDto: CreateRdvRequestDto, userId: string) {
  const service = await this.getServiceByType('rdv');
  const numeroReference = await this.generateReferenceNumber('RDV');

  const serviceRequest = this.serviceRequestRepository.create({
    type: 'rdv',
    etat: DemandeEtat.EN_ATTENTE,
    nom: createRdvRequestDto.nom,
    prenom: createRdvRequestDto.prenom,
    email: createRdvRequestDto.email,
    telephone: createRdvRequestDto.telephone,
    demande: createRdvRequestDto,
    numeroReference,
    utilisateur_id: userId,
    service_id: service.id,
    priorite: this.calculatePriority('rdv', createRdvRequestDto),
    dateLimiteTraitement: this.calculateProcessingDeadline('rdv'),
  });

  const savedRequest = await this.serviceRequestRepository.save(serviceRequest);
  
  // CORRECTION: Passer tous les paramètres requis pour CreateNotificationDto
  await this.notificationsService.create({
    userId: userId, // Correction: utiliser userId au lieu de juste userId
    message: `Votre demande de rendez-vous (${numeroReference}) a été soumise`,
    type: 'info',
    serviceRequestId: savedRequest.id, // Correction: utiliser serviceRequestId
  });

  // Envoyer email de confirmation
  await this.emailService.sendRequestConfirmation(
    createRdvRequestDto.email,
    'rdv',
    numeroReference
  );

  return savedRequest;
}

async createPartenariatRequest(createPartenariatRequestDto: CreatePartenariatRequestDto, userId: string) {
  const service = await this.getServiceByType('partenariat');
  const numeroReference = await this.generateReferenceNumber('PAR');

  const serviceRequest = this.serviceRequestRepository.create({
    type: 'partenariat',
    etat: DemandeEtat.EN_ATTENTE,
    nom: createPartenariatRequestDto.nom,
    prenom: createPartenariatRequestDto.prenom,
    email: createPartenariatRequestDto.email,
    demande: createPartenariatRequestDto,
    numeroReference,
    utilisateur_id: userId,
    service_id: service.id,
    priorite: this.calculatePriority('partenariat', createPartenariatRequestDto),
    dateLimiteTraitement: this.calculateProcessingDeadline('partenariat'),
  });

  const savedRequest = await this.serviceRequestRepository.save(serviceRequest);
  
  await this.notificationsService.create({
    userId: userId, // Correction
    message: `Votre demande de partenariat (${numeroReference}) a été soumise`,
    type: 'info',
    serviceRequestId: savedRequest.id, // Correction
  });

  await this.emailService.sendRequestConfirmation(
    createPartenariatRequestDto.email,
    'partenariat',
    numeroReference
  );

  return savedRequest;
}

async createMariageRequest(createMariageRequestDto: CreateMariageRequestDto, userId: string) {
  const service = await this.getServiceByType('mariage');
  const numeroReference = await this.generateReferenceNumber('MAR');

  const serviceRequest = this.serviceRequestRepository.create({
    type: 'mariage',
    etat: DemandeEtat.EN_ATTENTE,
    nom: createMariageRequestDto.conjoint1.nom,
    prenom: createMariageRequestDto.conjoint1.prenom,
    email: createMariageRequestDto.conjoint1.email,
    telephone: createMariageRequestDto.conjoint1.phone,
    demande: createMariageRequestDto,
    numeroReference,
    utilisateur_id: userId,
    service_id: service.id,
    priorite: this.calculatePriority('mariage', createMariageRequestDto),
    dateLimiteTraitement: this.calculateProcessingDeadline('mariage'),
  });

  const savedRequest = await this.serviceRequestRepository.save(serviceRequest);
  
  await this.notificationsService.create({
    userId: userId, // Correction
    message: `Votre demande de mariage (${numeroReference}) a été soumise`,
    type: 'info',
    serviceRequestId: savedRequest.id, // Correction
  });

  await this.emailService.sendRequestConfirmation(
    createMariageRequestDto.conjoint1.email,
    'mariage',
    numeroReference
  );

  return savedRequest;
}
  // ==================== GESTION DES TRAITEMENTS ====================

//  async createTreatment(createTreatmentDto: CreateTreatmentDto, agentId: string) {
//   // CORRECTION: Passer undefined au lieu de juste l'ID pour findOne
//   const demande = await this.findOne(createTreatmentDto.demandeId, undefined);
  
//   if (!demande.canBeProcessed()) {
//     throw new BadRequestException('Cette demande ne peut pas être traitée dans son état actuel');
//   }

//   // Vérifier qu'il n'y a pas déjà un traitement en cours
//   const existingTreatment = demande.getCurrentTreatment();
//   if (existingTreatment) {
//     throw new BadRequestException('Cette demande a déjà un traitement en cours');
//   }

//   const numeroTraitement = await this.generateTreatmentNumber();
  
//   const treatment = this.treatmentRepository.create({
//     numeroTraitement,
//     demande_id: demande.id, // CORRECTION: S'assurer que demande_id est bien défini
//     agent_id: agentId,
//     agentNom: createTreatmentDto.agentNom,
//     agentPrenom: createTreatmentDto.agentPrenom,
//     agentEmail: createTreatmentDto.agentEmail,
//     agentService: createTreatmentDto.agentService,
//     etat: TraitementEtat.EN_COURS,
//     resultat: TraitementResultat.EN_ATTENTE,
//     dateDebut: new Date(),
//     dateEcheance: createTreatmentDto.dateEcheance 
//       ? new Date(createTreatmentDto.dateEcheance)
//       : this.calculateTreatmentDeadline(demande.type),
//     commentairesInternes: createTreatmentDto.commentairesInternes,
//     messageAgent: createTreatmentDto.messageAgent,
//     notifyByEmail: createTreatmentDto.notifyByEmail || false,
//     documentsRequis: createTreatmentDto.documentsRequis || [],
//     tempsEstime: createTreatmentDto.tempsEstime,
//     // CORRECTION: Initialiser actionsLog
    
//   });

//   const savedTreatment = await this.treatmentRepository.save(treatment);

//   // Mettre à jour l'état de la demande
//   demande.etat = DemandeEtat.EN_COURS;
//   await this.serviceRequestRepository.save(demande);

//   // Log de l'action
//   // savedTreatment.addActionLog(
//   //   'Traitement créé',
//   //   `${createTreatmentDto.agentPrenom} ${createTreatmentDto.agentNom}`,
//   //   { commentaires: createTreatmentDto.commentairesInternes }
//   // );
//   await this.treatmentRepository.save(savedTreatment);

//   // CORRECTION: Créer la notification correctement
//   await this.notificationsService.create({
//     userId: demande.utilisateur_id,
//     message: `Votre demande ${demande.numeroReference} est maintenant en cours de traitement`,
//     type: 'info',
//     serviceRequestId: demande.id,
//   });

//   if (createTreatmentDto.notifyByEmail && createTreatmentDto.messageAgent) {
//     await this.emailService.sendTreatmentUpdate(
//       demande.email,
//       demande.numeroReference,
//       'en_cours',
//       createTreatmentDto.messageAgent
//     );
//   }

//   return savedTreatment;
// }
// async createTreatment(createTreatmentDto: CreateTreatmentDto, agentId: string) {
//   // Récupérer la demande avec toutes les relations nécessaires
//   const demande = await this.serviceRequestRepository.findOne({
//     where: { id: createTreatmentDto.demandeId },
//     relations: ['traitements'],
//   });
  
//   if (!demande) {
//     throw new NotFoundException('Demande non trouvée');
//   }

//   if (!demande.canBeProcessed()) {
//     throw new BadRequestException('Cette demande ne peut pas être traitée dans son état actuel');
//   }

//   // Vérifier qu'il n'y a pas déjà un traitement en cours
//   const existingTreatment = demande.getCurrentTreatment();
//   if (existingTreatment) {
//     throw new BadRequestException('Cette demande a déjà un traitement en cours');
//   }

//   const numeroTraitement = await this.generateTreatmentNumber();
//   console.log(demande,'demande',demande.id,ServiceRequest)
//   // CORRECTION: S'assurer que demande_id est explicitement défini
//   const treatment = this.treatmentRepository.create({
//     numeroTraitement,
//     demande,
//     demande_id: demande.id,
//     demandeId: demande.id,
//     agent_id: agentId,      // Explicitement défini
//     agentNom: createTreatmentDto.agentNom,
//     agentPrenom: createTreatmentDto.agentPrenom,
//     agentEmail: createTreatmentDto.agentEmail,
//     agentService: createTreatmentDto.agentService,
//     etat: TraitementEtat.EN_COURS,
//     resultat: TraitementResultat.EN_ATTENTE,
//     dateDebut: new Date(),
//     dateEcheance: createTreatmentDto.dateEcheance 
//       ? new Date(createTreatmentDto.dateEcheance)
//       : this.calculateTreatmentDeadline(demande.type),
//     commentairesInternes: createTreatmentDto.commentairesInternes,
//     messageAgent: createTreatmentDto.messageAgent,
//     notifyByEmail: createTreatmentDto.notifyByEmail || false,
//     documentsRequis: createTreatmentDto.documentsRequis || [],
//     tempsEstime: createTreatmentDto.tempsEstime,
//   });

//   // CORRECTION: Vérifier que les IDs sont bien définis avant la sauvegarde
//   if (!treatment.demande_id || !treatment.agent_id) {
//     throw new BadRequestException('Erreur: IDs de demande ou d\'agent manquants');
//   }

//   const savedTreatment = await this.treatmentRepository.save(treatment);

//   // Mettre à jour l'état de la demande
//   demande.etat = DemandeEtat.EN_COURS;
//   await this.serviceRequestRepository.save(demande);

//   // Créer la notification
//   await this.notificationsService.create({
//     userId: demande.utilisateur_id,
//     message: `Votre demande ${demande.numeroReference} est maintenant en cours de traitement`,
//     type: 'info',
//     serviceRequestId: demande.id,
//   });

//   if (createTreatmentDto.notifyByEmail && createTreatmentDto.messageAgent) {
//     await this.emailService.sendTreatmentUpdate(
//       demande.email,
//       demande.numeroReference,
//       'en_cours',
//       createTreatmentDto.messageAgent
//     );
//   }

//   return savedTreatment;
// }

async createTreatment(createTreatmentDto: CreateTreatmentDto, agentId: string) {
  // Vérifier la demande
  const demande = await this.serviceRequestRepository.findOne({
    where: { id: createTreatmentDto.demandeId },
    relations: ['traitements'],
  });

  if (!demande) {
    throw new NotFoundException('Demande non trouvée');
  }

  if (!demande.canBeProcessed || !demande.canBeProcessed()) {
    throw new BadRequestException('Cette demande ne peut pas être traitée dans son état actuel');
  }

  if (demande.getCurrentTreatment && demande.getCurrentTreatment()) {
    throw new BadRequestException('Cette demande a déjà un traitement en cours');
  }

  // Générer un numéro unique
  const numeroTraitement = await this.generateTreatmentNumber();

  // Créer le traitement
  const treatment = this.treatmentRepository.create({
    numeroTraitement,
    demande,                // Relation
    demande_id: demande.id, // FK explicite
    agent_id: agentId,      // FK explicite
    agentNom: createTreatmentDto.agentNom,
    agentPrenom: createTreatmentDto.agentPrenom,
    agentEmail: createTreatmentDto.agentEmail,
    agentService: createTreatmentDto.agentService,
    etat: TraitementEtat.EN_COURS,
    resultat: TraitementResultat.EN_ATTENTE,
    dateDebut: new Date(),
    dateEcheance: createTreatmentDto.dateEcheance 
      ? new Date(createTreatmentDto.dateEcheance)
      : this.calculateTreatmentDeadline(demande.type),
    commentairesInternes: createTreatmentDto.commentairesInternes,
    messageAgent: createTreatmentDto.messageAgent,
    notifyByEmail: createTreatmentDto.notifyByEmail ?? false,
    documentsRequis: createTreatmentDto.documentsRequis ?? [],
    tempsEstime: createTreatmentDto.tempsEstime,
  });
 // Notification
  await this.notificationsService.create({
    userId: demande.utilisateur_id,
    message: `Votre demande ${demande.numeroReference} est maintenant en cours de traitement`,
    type: 'info',
    serviceRequestId: demande.id,
  });

  // Envoi d'email si demandé
  if (createTreatmentDto.notifyByEmail && createTreatmentDto.messageAgent) {
    await this.emailService.sendTreatmentUpdate(
      demande.email,
      demande.numeroReference,
      'en_cours',
      createTreatmentDto.messageAgent
    );
  }
  // Vérification avant sauvegarde
  treatment.validateIntegrity();

  // Sauvegarder le traitement
  const savedTreatment = await this.treatmentRepository.save(treatment);

  // Mettre la demande en cours
  demande.etat = DemandeEtat.EN_COURS;
  await this.serviceRequestRepository.save(demande);

 

  return savedTreatment;
}

// 3. Corrections dans updateTreatment et finalizeTreatment
// async updateTreatment(treatmentId: string, updateTreatmentDto: UpdateTreatmentDto, agentId: string) {
//   const treatment = await this.treatmentRepository.findOne({
//     where: { id: treatmentId },
//     relations: ['demande', 'agent'],
//   });

//   if (!treatment) {
//     throw new NotFoundException('Traitement non trouvé');
//   }

//   // Vérifier que l'agent peut modifier ce traitement
//   if (treatment.agent_id !== agentId) {
//     throw new ForbiddenException('Vous ne pouvez pas modifier ce traitement');
//   }

//   // Mettre à jour les champs
//   Object.assign(treatment, updateTreatmentDto);

//   if (updateTreatmentDto.resultat && updateTreatmentDto.resultat !== TraitementResultat.EN_ATTENTE) {
//     treatment.etat = TraitementEtat.TERMINE;
//     treatment.dateFin = new Date();
//     treatment.tempsReel = treatment.calculateProcessingTime();

//     // Mettre à jour l'état de la demande selon le résultat
//     const newEtat = this.mapResultatToEtat(updateTreatmentDto.resultat);
//     treatment.demande.etat = newEtat;
//     await this.serviceRequestRepository.save(treatment.demande);
//   }

//   // Log de l'action
//   // treatment.addActionLog(
//   //   'Traitement mis à jour',
//   //   `${treatment.agentPrenom} ${treatment.agentNom}`,
//   //   updateTreatmentDto
//   // );

//   const savedTreatment = await this.treatmentRepository.save(treatment);

//   // CORRECTION: Notifier l'utilisateur si nécessaire
//   if (updateTreatmentDto.messageAgent) {
//     await this.notificationsService.create({
//       userId: treatment.demande.utilisateur_id,
//       message: updateTreatmentDto.messageAgent,
//       type: this.getNotificationTypeFromResultat(updateTreatmentDto.resultat),
//       serviceRequestId: treatment.demande.id,
//     });

//     if (updateTreatmentDto.notifyByEmail) {
//       await this.emailService.sendTreatmentUpdate(
//         treatment.demande.email,
//         treatment.demande.numeroReference,
//         updateTreatmentDto.resultat,
//         updateTreatmentDto.messageAgent
//       );
//     }
//   }

//   return savedTreatment;
// }
async updateTreatment(treatmentId: string, updateTreatmentDto: UpdateTreatmentDto, agentId: string) {
  const treatment = await this.treatmentRepository.findOne({
    where: { id: treatmentId },
    relations: ['demande', 'agent'],
  });

  if (!treatment) {
    throw new NotFoundException('Traitement non trouvé');
  }

  // Vérifier que l'agent peut modifier ce traitement
  if (treatment.agent_id !== agentId) {
    throw new ForbiddenException('Vous ne pouvez pas modifier ce traitement');
  }

  // CORRECTION: Mettre à jour seulement les champs autorisés, sans écraser les relations
  const allowedFields = [
    'etat',
    'resultat', 
    'etapeWorkflow',
    'commentairesInternes',
    'commentairesPublics',
    'messageAgent',
    'dateEcheance',
    'notifyByEmail',
    'notifyBySms',
    'documentsRequis',
    'tempsEstime'
  ];

  // Mise à jour sécurisée - seulement les champs autorisés
  allowedFields.forEach(field => {
    if (updateTreatmentDto[field] !== undefined) {
      if (field === 'dateEcheance' && updateTreatmentDto[field]) {
        treatment[field] = new Date(updateTreatmentDto[field]);
      } else {
        treatment[field] = updateTreatmentDto[field];
      }
    }
  });

  // Gestion spéciale du changement de résultat
  if (updateTreatmentDto.resultat && updateTreatmentDto.resultat !== TraitementResultat.EN_ATTENTE) {
    treatment.etat = TraitementEtat.TERMINE;
    treatment.dateFin = new Date();
    treatment.tempsReel = treatment.calculateProcessingTime();

    // Mettre à jour l'état de la demande selon le résultat
    const newEtat = this.mapResultatToEtat(updateTreatmentDto.resultat);
    treatment.demande.etat = newEtat;
    await this.serviceRequestRepository.save(treatment.demande);
  }

  const savedTreatment = await this.treatmentRepository.save(treatment);

  // Notifier l'utilisateur si nécessaire
  if (updateTreatmentDto.messageAgent) {
    await this.notificationsService.create({
      userId: treatment.demande.utilisateur_id,
      message: updateTreatmentDto.messageAgent,
      type: this.getNotificationTypeFromResultat(updateTreatmentDto.resultat),
      serviceRequestId: treatment.demande.id,
    });

    if (updateTreatmentDto.notifyByEmail) {
      await this.emailService.sendTreatmentUpdate(
        treatment.demande.email,
        treatment.demande.numeroReference,
        updateTreatmentDto.resultat || 'en_cours',
        updateTreatmentDto.messageAgent
      );
    }
  }

  return savedTreatment;
}
async finalizeTreatment(treatmentId: string, finalData: {
  resultat: TraitementResultat;
  commentairesPublics?: string;
  messageAgent?: string;
  notifyByEmail?: boolean;
}, agentId: string) {
  const treatment = await this.treatmentRepository.findOne({
    where: { id: treatmentId },
    relations: ['demande'],
  });

  if (!treatment) {
    throw new NotFoundException('Traitement non trouvé');
  }

  if (treatment.agent_id !== agentId) {
    throw new ForbiddenException('Vous ne pouvez pas finaliser ce traitement');
  }

  // Finaliser le traitement
  treatment.etat = TraitementEtat.TERMINE;
  treatment.resultat = finalData.resultat;
  treatment.commentairesPublics = finalData.commentairesPublics;
  treatment.messageAgent = finalData.messageAgent;
  treatment.notifyByEmail = finalData.notifyByEmail || false;
  treatment.dateFin = new Date();
  treatment.tempsReel = treatment.calculateProcessingTime();

  // Mettre à jour l'état de la demande
  const newEtat = this.mapResultatToEtat(finalData.resultat);
  treatment.demande.etat = newEtat;

  // Log final
  // treatment.addActionLog(
  //   'Traitement finalisé',
  //   `${treatment.agentPrenom} ${treatment.agentNom}`,
  //   { resultat: finalData.resultat, commentaires: finalData.commentairesPublics }
  // );

  await this.treatmentRepository.save(treatment);
  await this.serviceRequestRepository.save(treatment.demande);

  // CORRECTION: Notifications
  const notificationType = this.getNotificationTypeFromResultat(finalData.resultat);
  const message = finalData.messageAgent || `Votre demande ${treatment.demande.numeroReference} a été ${finalData.resultat}`;

  await this.notificationsService.create({
    userId: treatment.demande.utilisateur_id,
    message,
    type: notificationType,
    serviceRequestId: treatment.demande.id,
  });

  if (finalData.notifyByEmail) {
    await this.emailService.sendTreatmentFinal(
      treatment.demande.email,
      treatment.demande.numeroReference,
      finalData.resultat,
      message
    );
  }

  return treatment;
}

  // ==================== MÉTHODES UTILITAIRES ====================

  private async getServiceByType(type: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { type, isActive: true }
    });

    if (!service) {
      throw new NotFoundException(`Service de type "${type}" non trouvé`);
    }

    return service;
  }

  private async generateReferenceNumber(prefix: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Compter les demandes du jour pour ce type
    const count = await this.serviceRequestRepository.count({
      where: {
        numeroReference: Like(`${prefix}-${year}${month}${day}-%`),
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}-${year}${month}${day}-${sequence}`;
  }

  private async generateTreatmentNumber(): Promise<string> {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-8);
    return `TRT-${timestamp}`;
  }

  private calculatePriority(type: string, data: any): string {
    // Logique pour calculer la priorité selon le type et les données
    switch (type) {
      case 'rdv':
        return data.meetingTarget === 'maire' ? 'haute' : 'normale';
      case 'mariage':
        const dateMarriage = new Date(data.date1);
        const daysUntil = (dateMarriage.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        return daysUntil <= 30 ? 'haute' : 'normale';
      case 'partenariat':
        return data.partnershipNature === 'urgente' ? 'haute' : 'normale';
      default:
        return 'normale';
    }
  }

  private calculateProcessingDeadline(type: string): Date {
    const now = new Date();
    const deadlines = {
      'rdv': 5, // 5 jours ouvrés
      'partenariat': 15, // 15 jours ouvrés
      'mariage': 30, // 30 jours ouvrés
    };

    const days = deadlines[type] || 10;
    now.setDate(now.getDate() + days);
    return now;
  }

  private calculateTreatmentDeadline(type: string): Date {
    const now = new Date();
    const deadlines = {
      'rdv': 2, // 2 jours pour traiter
      'partenariat': 10, // 10 jours pour traiter
      'mariage': 20, // 20 jours pour traiter
    };

    const days = deadlines[type] || 5;
    now.setDate(now.getDate() + days);
    return now;
  }

  private mapResultatToEtat(resultat: TraitementResultat): DemandeEtat {
    switch (resultat) {
      case TraitementResultat.VALIDEE:
        return DemandeEtat.VALIDEE;
      case TraitementResultat.REFUSEE:
        return DemandeEtat.REFUSEE;
      case TraitementResultat.INCOMPLETE:
      case TraitementResultat.REPORTEE:
        return DemandeEtat.EN_ATTENTE;
      default:
        return DemandeEtat.EN_COURS;
    }
  }

  private getNotificationTypeFromResultat(resultat: TraitementResultat): string {
    switch (resultat) {
      case TraitementResultat.VALIDEE:
        return 'success';
      case TraitementResultat.REFUSEE:
        return 'error';
      case TraitementResultat.INCOMPLETE:
      case TraitementResultat.REPORTEE:
        return 'warning';
      default:
        return 'info';
    }
  }

  // ==================== RECHERCHE ET CONSULTATION ====================

  async findAll(filters: {
    page?: number;
    limit?: number;
    type?: string;
    etat?: string;
    priorite?: string;
    agentId?: string;
    dateDebut?: Date;
    dateFin?: Date;
  }) {
    const { page = 1, limit = 10 } = filters;
    
    const queryBuilder = this.serviceRequestRepository.createQueryBuilder('request')
      .leftJoinAndSelect('request.utilisateur', 'user')
      .leftJoinAndSelect('request.service', 'service')
      .leftJoinAndSelect('request.traitements', 'treatments')
      .leftJoinAndSelect('treatments.agent', 'agent');

    // Appliquer les filtres
    if (filters.type) {
      queryBuilder.andWhere('request.type = :type', { type: filters.type });
    }

    if (filters.etat) {
      queryBuilder.andWhere('request.etat = :etat', { etat: filters.etat });
    }

    if (filters.priorite) {
      queryBuilder.andWhere('request.priorite = :priorite', { priorite: filters.priorite });
    }

    if (filters.agentId) {
      queryBuilder.andWhere('treatments.agent_id = :agentId', { agentId: filters.agentId });
    }

    if (filters.dateDebut) {
      queryBuilder.andWhere('request.createdAt >= :dateDebut', { dateDebut: filters.dateDebut });
    }

    if (filters.dateFin) {
      queryBuilder.andWhere('request.createdAt <= :dateFin', { dateFin: filters.dateFin });
    }

    queryBuilder.orderBy('request.createdAt', 'DESC');

    const [requests, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: requests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId?: string) {
    const request = await this.serviceRequestRepository.findOne({
      where: { id },
      relations: [
        'utilisateur',
        'service',
        'documents',
        'traitements',
        'traitements.agent',
        'traitements.documentsGeneres',
        'notifications'
      ],
    });

    if (!request) {
      throw new NotFoundException('Demande non trouvée');
    }

    // Vérifier l'accès pour les utilisateurs non-admin
    if (userId && request.utilisateur_id !== userId) {
      throw new ForbiddenException('Accès non autorisé à cette demande');
    }

    return request;
  }

  async findByReference(numeroReference: string, userId?: string) {
    const request = await this.serviceRequestRepository.findOne({
      where: { numeroReference },
      relations: [
        'utilisateur',
        'service',
        'documents',
        'traitements',
        'traitements.agent',
        'traitements.documentsGeneres',
        'notifications'
      ],
    });

    if (!request) {
      throw new NotFoundException('Demande non trouvée');
    }

    if (userId && request.utilisateur_id !== userId) {
      throw new ForbiddenException('Accès non autorisé à cette demande');
    }

    return request;
  }

  async getUserRequests(userId: string, filters: {
    page?: number;
    limit?: number;
    type?: string;
    etat?: string;
  }) {
    const { page = 1, limit = 10 } = filters;
    
    const queryBuilder = this.serviceRequestRepository.createQueryBuilder('request')
      .where('request.utilisateur_id = :userId', { userId })
      .leftJoinAndSelect('request.service', 'service')
      .leftJoinAndSelect('request.traitements', 'treatments')
      .leftJoinAndSelect('treatments.agent', 'agent');

    if (filters.type) {
      queryBuilder.andWhere('request.type = :type', { type: filters.type });
    }

    if (filters.etat) {
      queryBuilder.andWhere('request.etat = :etat', { etat: filters.etat });
    }

    queryBuilder.orderBy('request.createdAt', 'DESC');

    const [requests, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: requests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ==================== GESTION DES DOCUMENTS ====================

  // async addDocument(requestId: string, documentData: {
  //   type: string;
  //   nom: string;
  //   description?: string;
  //   url: string;
  //   originalName: string;
  //   mimeType: string;
  //   size: number;
  // }) {
  //   const document = this.documentRepository.create({
  //     service_request_id: requestId,
  //     ...documentData,
  //   });

  //   const savedDocument = await this.documentRepository.save(document);

  //   // Notifier que des documents ont été ajoutés
  //   const request = await this.findOne(requestId);
  //   await this.notificationsService.create({
  //     userId: request.utilisateur_id,
  //     message: `Document "${documentData.nom}" ajouté à votre demande ${request.numeroReference}`,
  //     type: 'info',
  //     serviceRequestId: requestId,
  //   });

  //   return savedDocument;
  // }

  // async addTreatmentDocument(treatmentId: string, documentData: {
  //   type: string;
  //   nom: string;
  //   description?: string;
  //   url: string;
  //   originalName: string;
  //   mimeType: string;
  //   size: number;
  // }) {
  //   const treatment = await this.treatmentRepository.findOne({
  //     where: { id: treatmentId },
  //     relations: ['demande'],
  //   });

  //   if (!treatment) {
  //     throw new NotFoundException('Traitement non trouvé');
  //   }

  //   const document = this.treatmentDocumentRepository.create({
  //     treatment_id: treatmentId,
  //     ...documentData,
  //   });

  //   const savedDocument = await this.treatmentDocumentRepository.save(document);

  //   // Log de l'ajout de document
  //   treatment.addActionLog(
  //     'Document généré',
  //     `${treatment.agentPrenom} ${treatment.agentNom}`,
  //     { documentNom: documentData.nom, documentType: documentData.type }
  //   );
  //   await this.treatmentRepository.save(treatment);

  //   // Notifier l'utilisateur
  //   await this.notificationsService.create({
  //     userId: treatment.demande.utilisateur_id,
  //     message: `Un document "${documentData.nom}" a été généré pour votre demande ${treatment.demande.numeroReference}`,
  //     type: 'document',
  //     serviceRequestId: treatment.demande.id,
  //   });

  //   return savedDocument;
  // }
async addDocument(requestId: string, documentData: {
  type: string;
  nom: string;
  description?: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
}) {
  const document = this.documentRepository.create({
    service_request_id: requestId,
    ...documentData,
  });

  const savedDocument = await this.documentRepository.save(document);

  // CORRECTION: Notifier que des documents ont été ajoutés
  const request = await this.findOne(requestId, undefined);
  await this.notificationsService.create({
    userId: request.utilisateur_id,
    message: `Document "${documentData.nom}" ajouté à votre demande ${request.numeroReference}`,
    type: 'info',
    serviceRequestId: requestId,
  });

  return savedDocument;
}

async addTreatmentDocument(treatmentId: string, documentData: {
  type: string;
  nom: string;
  description?: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
}) {
  const treatment = await this.treatmentRepository.findOne({
    where: { id: treatmentId },
    relations: ['demande'],
  });

  if (!treatment) {
    throw new NotFoundException('Traitement non trouvé');
  }

  const document = this.treatmentDocumentRepository.create({
    treatment_id: treatmentId,
    ...documentData,
  });

  const savedDocument = await this.treatmentDocumentRepository.save(document);

  // Log de l'ajout de document
  // treatment.addActionLog(
  //   'Document généré',
  //   `${treatment.agentPrenom} ${treatment.agentNom}`,
  //   { documentNom: documentData.nom, documentType: documentData.type }
  // );
  await this.treatmentRepository.save(treatment);

  // CORRECTION: Notifier l'utilisateur
  await this.notificationsService.create({
    userId: treatment.demande.utilisateur_id,
    message: `Un document "${documentData.nom}" a été généré pour votre demande ${treatment.demande.numeroReference}`,
    type: 'document',
    serviceRequestId: treatment.demande.id,
  });

  return savedDocument;
}
  // ==================== STATISTIQUES ET RAPPORTS ====================

  async getStatistics(filters?: {
    dateDebut?: Date;
    dateFin?: Date;
    type?: string;
    agentId?: string;
  }) {
    const queryBuilder = this.serviceRequestRepository.createQueryBuilder('request');

    if (filters?.dateDebut) {
      queryBuilder.andWhere('request.createdAt >= :dateDebut', { dateDebut: filters.dateDebut });
    }

    if (filters?.dateFin) {
      queryBuilder.andWhere('request.createdAt <= :dateFin', { dateFin: filters.dateFin });
    }

    if (filters?.type) {
      queryBuilder.andWhere('request.type = :type', { type: filters.type });
    }

    // Statistiques générales
    const total = await queryBuilder.getCount();
    
    const parEtat = await queryBuilder
      .select('request.etat', 'etat')
      .addSelect('COUNT(*)', 'count')
      .groupBy('request.etat')
      .getRawMany();

    const parType = await queryBuilder
      .select('request.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('request.type')
      .getRawMany();

    const parPriorite = await queryBuilder
      .select('request.priorite', 'priorite')
      .addSelect('COUNT(*)', 'count')
      .groupBy('request.priorite')
      .getRawMany();

    // Statistiques des traitements
    const treatmentQuery = this.treatmentRepository.createQueryBuilder('treatment')
      .leftJoin('treatment.demande', 'request');

    if (filters?.dateDebut) {
      treatmentQuery.andWhere('treatment.createdAt >= :dateDebut', { dateDebut: filters.dateDebut });
    }

    if (filters?.dateFin) {
      treatmentQuery.andWhere('treatment.createdAt <= :dateFin', { dateFin: filters.dateFin });
    }

    if (filters?.agentId) {
      treatmentQuery.andWhere('treatment.agent_id = :agentId', { agentId: filters.agentId });
    }

    const tempsTraitementMoyen = await treatmentQuery
      .select('AVG(treatment.tempsReel)', 'moyenne')
      .where('treatment.tempsReel IS NOT NULL')
      .getRawOne();

    const traitementParResultat = await treatmentQuery
      .select('treatment.resultat', 'resultat')
      .addSelect('COUNT(*)', 'count')
      .groupBy('treatment.resultat')
      .getRawMany();

    const demandesEnRetard = await this.serviceRequestRepository
      .createQueryBuilder('request')
      .where('request.dateLimiteTraitement < :now', { now: new Date() })
      .andWhere('request.etat IN (:...etats)', { etats: [DemandeEtat.EN_ATTENTE, DemandeEtat.EN_COURS] })
      .getCount();

    return {
      general: {
        total,
        parEtat: parEtat.map(item => ({ etat: item.etat, count: parseInt(item.count) })),
        parType: parType.map(item => ({ type: item.type, count: parseInt(item.count) })),
        parPriorite: parPriorite.map(item => ({ priorite: item.priorite, count: parseInt(item.count) })),
        demandesEnRetard,
      },
      traitements: {
        tempsTraitementMoyen: parseFloat(tempsTraitementMoyen?.moyenne || '0'),
        parResultat: traitementParResultat.map(item => ({ 
          resultat: item.resultat, 
          count: parseInt(item.count) 
        })),
      },
    };
  }

  async getAgentWorkload(agentId: string) {
    const traitementsEnCours = await this.treatmentRepository.count({
      where: {
        agent_id: agentId,
        etat: TraitementEtat.EN_COURS,
      },
    });

    const traitementsEnRetard = await this.treatmentRepository
      .createQueryBuilder('treatment')
      .where('treatment.agent_id = :agentId', { agentId })
      .andWhere('treatment.dateEcheance < :now', { now: new Date() })
      .andWhere('treatment.etat = :etat', { etat: TraitementEtat.EN_COURS })
      .getCount();

    const derniersMois = await this.treatmentRepository
      .createQueryBuilder('treatment')
      .where('treatment.agent_id = :agentId', { agentId })
      .andWhere('treatment.createdAt >= :dateDebut', { 
        dateDebut: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
      })
      .select('treatment.resultat', 'resultat')
      .addSelect('COUNT(*)', 'count')
      .groupBy('treatment.resultat')
      .getRawMany();

    const tempsTraitementMoyen = await this.treatmentRepository
      .createQueryBuilder('treatment')
      .where('treatment.agent_id = :agentId', { agentId })
      .andWhere('treatment.tempsReel IS NOT NULL')
      .select('AVG(treatment.tempsReel)', 'moyenne')
      .getRawOne();

    return {
      traitementsEnCours,
      traitementsEnRetard,
      derniersMois: derniersMois.map(item => ({ 
        resultat: item.resultat, 
        count: parseInt(item.count) 
      })),
      tempsTraitementMoyen: parseFloat(tempsTraitementMoyen?.moyenne || '0'),
    };
  }
}