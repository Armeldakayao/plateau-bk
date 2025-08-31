// // // /* eslint-disable prettier/prettier */
// // // import {
// // //   Entity,
// // //   PrimaryGeneratedColumn,
// // //   Column,
// // //   CreateDateColumn,
// // //   UpdateDateColumn,
// // //   OneToMany,
// // // } from 'typeorm';
// // // import { ServiceRequest } from '../../services-requests/entities/service-request.entity';


// // // @Entity('services')
// // // export class Service {
// // //   @PrimaryGeneratedColumn('uuid')
// // //   id: string;

// // //   @Column()
// // //   title: string;

// // //   @Column('text')
// // //   description: string;

// // //   @Column()
// // //   category: string;

// // //   @Column({ nullable: true })
// // //   estimatedDuration: string;

// // //   @Column('json', { nullable: true })
// // //   conditions: string[];

// // //   @Column('json', { nullable: true })
// // //   requiredDocuments: string[];

// // //   @Column({ default: 'basic' })
// // //   type: string; // 'basic' | 'advanced'

// // //   @Column({ nullable: true })
// // //   icon: string;

// // //   @OneToMany(() => ServiceRequest, (serviceRequest) => serviceRequest.service)
// // //   serviceRequests: ServiceRequest[];

// // //   @CreateDateColumn()
// // //   createdAt: Date;

// // //   @UpdateDateColumn()
// // //   updatedAt: Date;
// // // }
// // import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
// // import { ServiceRequest } from '../../services-requests/entities/service-request.entity';


// // @Entity('services')
// // export class Service {
// //   @PrimaryGeneratedColumn('uuid')
// //   id: string;

// //   @Column({ unique: true })
// //   type: string; // 'rdv', 'partenariat', 'mariage', etc.

// //   @Column()
// //   title: string;

// //   @Column('text')
// //   description: string;

// //   @Column({ nullable: true })
// //   icon: string;

// //   @Column({ default: true })
// //   isActive: boolean;

// //   @Column('simple-array', { nullable: true })
// //   requiredDocuments: string[]; // Documents requis pour ce service

// //   @Column('json', { nullable: true })
// //   formFields: any[]; // Structure du formulaire spécifique

// //   @Column('json', { nullable: true })
// //   workflow: any; // Configuration du workflow de traitement

// //   @OneToMany(() => ServiceRequest, serviceRequest => serviceRequest.service)
// //   serviceRequests: ServiceRequest[];

// //   @CreateDateColumn()
// //   createdAt: Date;

// //   @UpdateDateColumn()
// //   updatedAt: Date;
// // }

// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
// import { ServiceRequest } from '../../services-requests/entities/service-request.entity';


// @Entity('services')
// export class Service {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ unique: true })
//   type: string; // 'rdv', 'partenariat', 'mariage', etc.

//   @Column()
//   title: string;

//   @Column('text')
//   description: string;

//   @Column({ nullable: true })
//   icon: string;

//   @Column({ nullable: true })
//   category: string; // Ajout de la propriété category

//   @Column({ default: true })
//   isActive: boolean;

//   @Column('simple-array', { nullable: true })
//   requiredDocuments: string[]; // Documents requis pour ce service

//   @Column('json', { nullable: true })
//   formFields: any[]; // Structure du formulaire spécifique

//   @Column('json', { nullable: true })
//   workflow: any; // Configuration du workflow de traitement

//   @OneToMany(() => ServiceRequest, serviceRequest => serviceRequest.service)
//   serviceRequests: ServiceRequest[];

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }



import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany 
} from 'typeorm';
import { ServiceRequest } from '../../services-requests/entities/service-request.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  type: string; // 'rdv', 'partenariat', 'mariage', etc.

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  category: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('simple-array', { nullable: true })
  requiredDocuments: string[];

  @Column('json', { nullable: true })
  formFields: any[];

  @Column('json', { nullable: true })
  workflow: any;

  @OneToMany(() => ServiceRequest, serviceRequest => serviceRequest.service)
  serviceRequests: ServiceRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}