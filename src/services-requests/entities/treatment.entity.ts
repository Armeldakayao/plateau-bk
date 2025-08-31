// // import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
// // import { ServiceRequest } from './service-request.entity';
// // import { User } from '../../users/entities/user.entity';
// // import { TreatmentDocument } from './treatment-document.entity';


// // export enum TraitementEtat {
// //   EN_COURS = 'en_cours',
// //   TERMINE = 'termine',
// //   SUSPENDU = 'suspendu',
// //   ANNULE = 'annule'
// // }

// // export enum TraitementResultat {
// //   EN_ATTENTE = 'en_attente',
// //   VALIDEE = 'validee',
// //   REFUSEE = 'refusee',
// //   INCOMPLETE = 'incomplete', // Demande incomplète, documents manquants
// //   REPORTEE = 'reportee' // Report pour complément d'information
// // }

// // // @Entity('treatments')
// // // export class Treatment {
// // //   @PrimaryGeneratedColumn('uuid')
// // //   id: string;

// // //   // Numéro de traitement unique
// // //   @Column({ unique: true })
// // //   numeroTraitement: string;

// // //   @Column({
// // //     type: 'enum',
// // //     enum: TraitementEtat,
// // //     default: TraitementEtat.EN_COURS
// // //   })
// // //   etat: TraitementEtat;

// // //   @Column({
// // //     type: 'enum',
// // //     enum: TraitementResultat,
// // //     default: TraitementResultat.EN_ATTENTE
// // //   })
// // //   resultat: TraitementResultat;

// // //   // Étape du workflow (si applicable)
// // //   @Column({ nullable: true })
// // //   etapeWorkflow: string;

// // //   // Commentaires internes (non visibles par le demandeur)
// // //   @Column('text', { nullable: true })
// // //   commentairesInternes: string;

// // //   // Commentaires publics (visibles par le demandeur)
// // //   @Column('text', { nullable: true })
// // //   commentairesPublics: string;

// // //   // Dates de traitement
// // //   @Column({ nullable: true })
// // //   dateDebut: Date;

// // //   @Column({ nullable: true })
// // //   dateFin: Date;

// // //   @Column({ nullable: true })
// // //   dateEcheance: Date; // Date limite pour cette étape

// // //   // Agent assigné (informations dénormalisées pour l'historique)
// // //   @Column()
// // //   agentNom: string;

// // //   @Column()
// // //   agentPrenom: string;

// // //   @Column()
// // //   agentEmail: string;

// // //   @Column({ nullable: true })
// // //   agentService: string; // Service/département de l'agent

// // //   // Message pour le demandeur
// // //   @Column('text', { nullable: true })
// // //   messageAgent: string;

// // //   // Flags de notification
// // //   @Column({ default: false })
// // //   notifyByEmail: boolean;

// // //   @Column({ default: false })
// // //   notifyBySms: boolean;

// // //   // Pièces jointes spécifiques à ce traitement
// // //   @Column('simple-array', { nullable: true })
// // //   documentsRequis: string[]; // Documents additionnels requis

// // //   // Actions effectuées (log des actions)
// // //   @Column('json', { nullable: true })
// // //   actionsLog: Array<{
// // //     action: string;
// // //     date: Date;
// // //     agent: string;
// // //     details?: any;
// // //   }>;

// // //   // Temps estimé et réel de traitement (en heures)
// // //   @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
// // //   tempsEstime: number;

// // //   @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
// // //   tempsReel: number;

// // //   // Relations
// // //   @ManyToOne(() => ServiceRequest, serviceRequest => serviceRequest.traitements, { nullable: false })
// // //   @JoinColumn({ name: 'demande_id' })
// // //   demande: ServiceRequest;

// // //   @Column()
// // //   demande_id: string;

// // //   @ManyToOne(() => User, { nullable: false })
// // //   @JoinColumn({ name: 'agent_id' })
// // //   agent: User;

// // //   @Column()
// // //   agent_id: string;

// // //   // Documents générés par l'agent pour le demandeur
// // //   @OneToMany(() => TreatmentDocument, doc => doc.treatment, { cascade: true })
// // //   documentsGeneres: TreatmentDocument[];

// // //   @CreateDateColumn()
// // //   createdAt: Date;

// // //   @UpdateDateColumn()
// // //   updatedAt: Date;

// // //   // Méthodes utilitaires
// // //   calculateProcessingTime(): number {
// // //     if (!this.dateDebut || !this.dateFin) return 0;
// // //     return (this.dateFin.getTime() - this.dateDebut.getTime()) / (1000 * 60 * 60); // en heures
// // //   }

// // //   isOverdue(): boolean {
// // //     if (!this.dateEcheance) return false;
// // //     return new Date() > this.dateEcheance && this.etat === TraitementEtat.EN_COURS;
// // //   }

// // //   addActionLog(action: string, agent: string, details?: any): void {
// // //     if (!this.actionsLog) this.actionsLog = [];
// // //     this.actionsLog.push({
// // //       action,
// // //       date: new Date(),
// // //       agent,
// // //       details
// // //     });
// // //   }
// // // }

// // @Entity('treatments')
// // export class Treatment {
// //   @PrimaryGeneratedColumn('uuid')
// //   id: string;

// //   // Numéro de traitement unique
// //   @Column({ unique: true })
// //   numeroTraitement: string;

// //   @Column({
// //     type: 'enum',
// //     enum: TraitementEtat,
// //     default: TraitementEtat.EN_COURS
// //   })
// //   etat: TraitementEtat;

// //   @Column({
// //     type: 'enum',
// //     enum: TraitementResultat,
// //     default: TraitementResultat.EN_ATTENTE
// //   })
// //   resultat: TraitementResultat;

// //   // Étape du workflow (si applicable)
// //   @Column({ nullable: true })
// //   etapeWorkflow: string;

// //   // Commentaires internes (non visibles par le demandeur)
// //   @Column('text', { nullable: true })
// //   commentairesInternes: string;

// //   // Commentaires publics (visibles par le demandeur)
// //   @Column('text', { nullable: true })
// //   commentairesPublics: string;

// //   // Dates de traitement
// //   @Column({ nullable: true })
// //   dateDebut: Date;

// //   @Column({ nullable: true })
// //   dateFin: Date;

// //   @Column({ nullable: true })
// //   dateEcheance: Date; // Date limite pour cette étape

// //   // Agent assigné (informations dénormalisées pour l'historique)
// //   @Column()
// //   agentNom: string;

// //   @Column()
// //   agentPrenom: string;

// //   @Column()
// //   agentEmail: string;

// //   @Column({ nullable: true })
// //   agentService: string; // Service/département de l'agent

// //   // Message pour le demandeur
// //   @Column('text', { nullable: true })
// //   messageAgent: string;

// //   // Flags de notification
// //   @Column({ default: false })
// //   notifyByEmail: boolean;

// //   @Column({ default: false })
// //   notifyBySms: boolean;

// //   // Pièces jointes spécifiques à ce traitement
// //   @Column('simple-array', { nullable: true })
// //   documentsRequis: string[]; // Documents additionnels requis

// //   // Actions effectuées (log des actions)
// //   @Column('json', { nullable: true, default: () => "'[]'" }) // CORRECTION: Valeur par défaut
// //   actionsLog: Array<{
// //     action: string;
// //     date: Date;
// //     agent: string;
// //     details?: any;
// //   }>;

// //   // Temps estimé et réel de traitement (en heures)
// //   @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
// //   tempsEstime: number;

// //   @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
// //   tempsReel: number;

// //   // Relations
// //   // CORRECTION: S'assurer que la relation est correctement configurée
// //   @ManyToOne(() => ServiceRequest, serviceRequest => serviceRequest.traitements, { 
// //     nullable: false,
// //     onDelete: 'CASCADE' // CORRECTION: Ajouter onDelete pour éviter les orphelins
// //   })
// //   @JoinColumn({ name: 'demande_id' })
// //   demande: ServiceRequest;

// //   @Column({ nullable: false }) // CORRECTION: S'assurer que ce champ ne peut pas être null
// //   demande_id: string;

// //   @ManyToOne(() => User, { nullable: false })
// //   @JoinColumn({ name: 'agent_id' })
// //   agent: User;

// //   @Column({ nullable: false }) // CORRECTION: S'assurer que ce champ ne peut pas être null
// //   agent_id: string;

// //   // Documents générés par l'agent pour le demandeur
// //   @OneToMany(() => TreatmentDocument, doc => doc.treatment, { cascade: true })
// //   documentsGeneres: TreatmentDocument[];

// //   @CreateDateColumn()
// //   createdAt: Date;

// //   @UpdateDateColumn()
// //   updatedAt: Date;

// //   // Méthodes utilitaires
// //   calculateProcessingTime(): number {
// //     if (!this.dateDebut || !this.dateFin) return 0;
// //     return (this.dateFin.getTime() - this.dateDebut.getTime()) / (1000 * 60 * 60); // en heures
// //   }

// //   isOverdue(): boolean {
// //     if (!this.dateEcheance) return false;
// //     return new Date() > this.dateEcheance && this.etat === TraitementEtat.EN_COURS;
// //   }

// //   addActionLog(action: string, agent: string, details?: any): void {
// //     // CORRECTION: Initialiser actionsLog si nécessaire
// //     if (!this.actionsLog) {
// //       this.actionsLog = [];
// //     }
// //     this.actionsLog.push({
// //       action,
// //       date: new Date(),
// //       agent,
// //       details
// //     });
// //   }
// // }

// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
// import { ServiceRequest } from './service-request.entity';
// import { User } from '../../users/entities/user.entity';
// import { TreatmentDocument } from './treatment-document.entity';

// export enum TraitementEtat {
//   EN_COURS = 'en_cours',
//   TERMINE = 'termine',
//   SUSPENDU = 'suspendu',
//   ANNULE = 'annule'
// }

// export enum TraitementResultat {
//   EN_ATTENTE = 'en_attente',
//   VALIDEE = 'validee',
//   REFUSEE = 'refusee',
//   INCOMPLETE = 'incomplete', // Demande incomplète, documents manquants
//   REPORTEE = 'reportee' // Report pour complément d'information
// }

// @Entity('treatments')
// export class Treatment {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   // Numéro de traitement unique
//   @Column({ unique: true })
//   numeroTraitement: string;

//   @Column({
//     type: 'enum',
//     enum: TraitementEtat,
//     default: TraitementEtat.EN_COURS
//   })
//   etat: TraitementEtat;

//   @Column({
//     type: 'enum',
//     enum: TraitementResultat,
//     default: TraitementResultat.EN_ATTENTE
//   })
//   resultat: TraitementResultat;

//   // Étape du workflow (si applicable)
//   @Column({ nullable: true })
//   etapeWorkflow: string;

//   // Commentaires internes (non visibles par le demandeur)
//   @Column('text', { nullable: true })
//   commentairesInternes: string;

//   // Commentaires publics (visibles par le demandeur)
//   @Column('text', { nullable: true })
//   commentairesPublics: string;

//   // Dates de traitement
//   @Column({ nullable: true })
//   dateDebut: Date;

//   @Column({ nullable: true })
//   dateFin: Date;

//   @Column({ nullable: true })
//   dateEcheance: Date; // Date limite pour cette étape

//   // Agent assigné (informations dénormalisées pour l'historique)
//   @Column()
//   agentNom: string;

//   @Column()
//   agentPrenom: string;

//   @Column()
//   agentEmail: string;

//   @Column({ nullable: true })
//   agentService: string; // Service/département de l'agent

//   // Message pour le demandeur
//   @Column('text', { nullable: true })
//   messageAgent: string;

//   // Flags de notification
//   @Column({ default: false })
//   notifyByEmail: boolean;

//   @Column({ default: false })
//   notifyBySms: boolean;

//   // Pièces jointes spécifiques à ce traitement
//   @Column('simple-array', { nullable: true })
//   documentsRequis: string[]; // Documents additionnels requis

//   // SUPPRIMÉ: actionsLog n'est plus nécessaire

//   // Temps estimé et réel de traitement (en heures)
//   @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
//   tempsEstime: number;

//   @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
//   tempsReel: number;

//   // Relations
//   @ManyToOne(() => ServiceRequest, serviceRequest => serviceRequest.traitements, { 
//     nullable: false,
//     onDelete: 'CASCADE'
//   })
//   @JoinColumn({ name: 'demande_id' })
//   demande: ServiceRequest;

//   @Column({ nullable: false })
//   demande_id: string;

//   @ManyToOne(() => User, { nullable: false })
//   @JoinColumn({ name: 'agent_id' })
//   agent: User;

//   @Column({ nullable: false })
//   agent_id: string;

//   // Documents générés par l'agent pour le demandeur
//   @OneToMany(() => TreatmentDocument, doc => doc.treatment, { cascade: true })
//   documentsGeneres: TreatmentDocument[];

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;

//   // Méthodes utilitaires
//   calculateProcessingTime(): number {
//     if (!this.dateDebut || !this.dateFin) return 0;
//     return (this.dateFin.getTime() - this.dateDebut.getTime()) / (1000 * 60 * 60); // en heures
//   }

//   isOverdue(): boolean {
//     if (!this.dateEcheance) return false;
//     return new Date() > this.dateEcheance && this.etat === TraitementEtat.EN_COURS;
//   }

//   // SUPPRIMÉ: addActionLog() n'est plus nécessaire
// }

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { User } from '../../users/entities/user.entity';
import { TreatmentDocument } from './treatment-document.entity';

export enum TraitementEtat {
  EN_COURS = 'en_cours',
  TERMINE = 'termine',
  SUSPENDU = 'suspendu',
  ANNULE = 'annule'
}

export enum TraitementResultat {
  EN_ATTENTE = 'en_attente',
  VALIDEE = 'validee',
  REFUSEE = 'refusee',
  INCOMPLETE = 'incomplete',
  REPORTEE = 'reportee'
}

@Entity('treatments')
export class Treatment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numeroTraitement: string;

  @Column({
    type: 'enum',
    enum: TraitementEtat,
    default: TraitementEtat.EN_COURS
  })
  etat: TraitementEtat;

  @Column({
    type: 'enum',
    enum: TraitementResultat,
    default: TraitementResultat.EN_ATTENTE
  })
  resultat: TraitementResultat;

  @Column({ nullable: true })
  etapeWorkflow: string;

  @Column('text', { nullable: true })
  commentairesInternes: string;

  @Column('text', { nullable: true })
  commentairesPublics: string;

  @Column({ nullable: true })
  dateDebut: Date;

  @Column({ nullable: true })
  dateFin: Date;

  @Column({ nullable: true })
  dateEcheance: Date;

  // Informations de l'agent (dénormalisées)
  @Column()
  agentNom: string;

  @Column()
  agentPrenom: string;

  @Column()
  agentEmail: string;

  @Column({ nullable: true })
  agentService: string;

  @Column('text', { nullable: true })
  messageAgent: string;

  @Column({ default: false })
  notifyByEmail: boolean;

  @Column({ default: false })
  notifyBySms: boolean;

  @Column('simple-array', { nullable: true })
  documentsRequis: string[];

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  tempsEstime: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  tempsReel: number;

  // CORRECTION: Relations avec contraintes strictes
  @ManyToOne(() => ServiceRequest, serviceRequest => serviceRequest.traitements, { 
    nullable: false,
    onDelete: 'CASCADE',
    eager: false // Éviter les chargements automatiques qui pourraient causer des conflits
  })
  @JoinColumn({ name: 'demande_id' })
  demande: ServiceRequest;

  // CORRECTION: Column avec nullable: false explicite
  @Column({ name: 'demande_id', nullable: false })
  demande_id: string;

  @ManyToOne(() => User, { 
    nullable: false,
    eager: false
  })
  @JoinColumn({ name: 'agent_id' })
  agent: User;

  // CORRECTION: Column avec nullable: false explicite
  @Column({ name: 'agent_id', nullable: false })
  agent_id: string;

  @OneToMany(() => TreatmentDocument, doc => doc.treatment, { cascade: true })
  documentsGeneres: TreatmentDocument[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Méthodes utilitaires
  calculateProcessingTime(): number {
    if (!this.dateDebut || !this.dateFin) return 0;
    return (this.dateFin.getTime() - this.dateDebut.getTime()) / (1000 * 60 * 60);
  }

  isOverdue(): boolean {
    if (!this.dateEcheance) return false;
    return new Date() > this.dateEcheance && this.etat === TraitementEtat.EN_COURS;
  }

  // CORRECTION: Méthode pour valider l'intégrité avant sauvegarde
  validateIntegrity(): void {
    if (!this.demande_id) {
      throw new Error('demande_id est requis');
    }
    if (!this.agent_id) {
      throw new Error('agent_id est requis');
    }
    if (!this.numeroTraitement) {
      throw new Error('numeroTraitement est requis');
    }
  }
}