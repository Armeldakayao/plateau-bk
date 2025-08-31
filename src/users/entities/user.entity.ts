
// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   OneToMany,
// } from 'typeorm';
// import { Exclude } from 'class-transformer';

// import { Notification } from '../../notifications/entities/notification.entity';
// import { ServiceRequest } from '../../services-requests/entities/service-request.entity';

// @Entity('users')
// export class User {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   firstName: string;

//   @Column()
//   lastName: string;

//   @Column({ type: 'date' })
//   birthDate: Date;

//   @Column()
//   birthPlace: string;

//   @Column()
//   nationality: string;

//   @Column()
//   city: string;

//   @Column({ unique: true })
//   email: string;

//   @Column()
//   phone: string;

//   @Column()
//   @Exclude()
//   password: string;

//   @Column()
//   idType: string;

//   @Column()
//   idNumber: string;

//   @Column({ default: false })
//   acceptTerms: boolean;

//   @Column({ default: false })
//   acceptDataPolicy: boolean;

//   @Column({ default: false })
//   isVerified: boolean;

//   @Column({ nullable: true })
//   @Exclude()
//   otpCode: string;

//   @Column({ nullable: true })
//   @Exclude()
//   otpExpiration: Date;

//   @Column({ nullable: true })
//   @Exclude()
//   resetToken: string;

//   @Column({ nullable: true })
//   @Exclude()
//   resetTokenExpiration: Date;

//   @Column({ default: 'user' })
//   role: string; // 'user' | 'admin'

//  @OneToMany(() => ServiceRequest, (serviceRequest) => serviceRequest.utilisateur)
// serviceRequests: ServiceRequest[];

//   @OneToMany(() => Notification, (notification) => notification.user)
//   notifications: Notification[];

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
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Notification } from '../../notifications/entities/notification.entity';
import { ServiceRequest } from '../../services-requests/entities/service-request.entity';
import { UserDocument } from './user-document.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column()
  birthPlace: string;

  @Column()
  nationality: string;

  @Column()
  city: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  idType: string;

  @Column()
  idNumber: string;

  @Column({ default: false })
  acceptTerms: boolean;

  @Column({ default: false })
  acceptDataPolicy: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  @Exclude()
  otpCode: string;

  @Column({ nullable: true })
  @Exclude()
  otpExpiration: Date;

  @Column({ nullable: true })
  @Exclude()
  resetToken: string;

  @Column({ nullable: true })
  @Exclude()
  resetTokenExpiration: Date;

  @Column({ default: 'user' })
  role: string; // 'user' | 'admin' | 'moderator'

  @Column({ nullable: true })
  profilePhoto: string; // URL/chemin vers la photo de profil

  @OneToMany(() => ServiceRequest, (serviceRequest) => serviceRequest.utilisateur)
  serviceRequests: ServiceRequest[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => UserDocument, (document) => document.user, { cascade: true })
  documents: UserDocument[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}