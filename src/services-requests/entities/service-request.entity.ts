// /* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/no-unsafe-return */
// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { User } from '../../users/entities/user.entity';
// import { Service } from '../../services/entities/service.entity';

// @Entity('service_requests')
// export class ServiceRequest {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   type: string;

//   @Column('json')
//   payload: Record<string, any>;

//   @Column({ default: 'pending' })
//   status: string; // 'pending' | 'processing' | 'completed' | 'rejected'

//   @Column({ nullable: true })
//   adminNotes: string;

//   @ManyToOne(() => User, (user) => user.serviceRequests)
//   @JoinColumn({ name: 'userId' })
//   user: User;

//   @Column()
//   userId: string;

//   @ManyToOne(() => Service, (service) => service.serviceRequests, { nullable: true })
//   @JoinColumn({ name: 'serviceId' })
//   service: Service;

//   @Column({ nullable: true })
//   serviceId: string;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Service } from '../../services/entities/service.entity';

import { Notification } from '../../notifications/entities/notification.entity';
import { Treatment } from './treatment.entity';
import { ServiceRequestDocument } from './service-request-document.entity';

export enum DemandeEtat {
  EN_ATTENTE = 'en_attente',
  EN_COURS = 'en_cours',
  VALIDEE = 'validee',
  REFUSEE = 'refusee',
  ANNULEE = 'annulee'
}

@Entity('service_requests')
export class ServiceRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string; // 'rdv', 'partenariat', 'mariage'

  @Column({
    type: 'enum',
    enum: DemandeEtat,
    default: DemandeEtat.EN_ATTENTE
  })
  etat: DemandeEtat;

  // Informations demandeur (dénormalisées pour performance et historique)
  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  telephone: string;

  // Données spécifiques à la demande (JSON selon le type)
  @Column('json')
  demande: Record<string, any>;

  // Numéro de référence unique pour la demande
  @Column({ unique: true })
  numeroReference: string;

  // Priorité de traitement
  @Column({ default: 'normale' })
  priorite: string; // 'faible', 'normale', 'haute', 'urgente'

  // Date limite de traitement (calculée selon le type de service)
  @Column({ nullable: true })
  dateLimiteTraitement: Date;

  // Relations
  @ManyToOne(() => User, user => user.serviceRequests, { nullable: false })
  @JoinColumn({ name: 'utilisateur_id' })
  utilisateur: User;

  @Column()
  utilisateur_id: string;

  @ManyToOne(() => Service, service => service.serviceRequests, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column()
  service_id: string;

  // Documents fournis par le demandeur
  @OneToMany(() => ServiceRequestDocument, doc => doc.serviceRequest, { cascade: true })
  documents: ServiceRequestDocument[];

  // Traitements de la demande (historique complet)
  @OneToMany(() => Treatment, treatment => treatment.demande, { cascade: true })
  traitements: Treatment[];

  // Notifications liées à cette demande
  @OneToMany(() => Notification, notification => notification.serviceRequest, { cascade: true })
  notifications: Notification[];

  // Métadonnées pour le suivi
  @Column('json', { nullable: true })
  metadata: {
    source?: string; // 'web', 'mobile', 'guichet'
    ipAddress?: string;
    userAgent?: string;
    version?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Méthodes utilitaires
  getCurrentTreatment(): Treatment | null {
    if (!this.traitements || this.traitements.length === 0) return null;
    return this.traitements.find(t => t.etat === 'en_cours') || null;
  }

  getLastTreatment(): Treatment | null {
    if (!this.traitements || this.traitements.length === 0) return null;
    return this.traitements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }

  canBeProcessed(): boolean {
    return this.etat === DemandeEtat.EN_ATTENTE;
  }
}