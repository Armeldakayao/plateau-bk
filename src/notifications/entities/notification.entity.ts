// // import {
// //   Entity,
// //   PrimaryGeneratedColumn,
// //   Column,
// //   CreateDateColumn,
// //   ManyToOne,
// //   JoinColumn,
// // } from 'typeorm';
// // import { User } from '../../users/entities/user.entity';

// // @Entity('notifications')
// // export class Notification {
// //   @PrimaryGeneratedColumn('uuid')
// //   id: string;

// //   @Column()
// //   message: string;

// //   @Column()
// //   type: string; // 'info' | 'warning' | 'success' | 'error'

// //   @Column({ default: false })
// //   isRead: boolean;

// //   @ManyToOne(() => User, (user) => user.notifications)
// //   @JoinColumn({ name: 'userId' })
// //   user: User;

// //   @Column()
// //   userId: string;

// //   @CreateDateColumn()
// //   createdAt: Date;
// // }
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { User } from '../../users/entities/user.entity';
// import { ServiceRequest } from '../../services-requests/entities/service-request.entity';


// @Entity('notifications')
// export class Notification {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   message: string;

//   @Column()
//   type: string; // 'info', 'success', 'warning', 'error', 'document'

//   @Column({ default: false })
//   isRead: boolean;

//   @ManyToOne(() => User, user => user.notifications)
//   @JoinColumn({ name: 'user_id' })
//   user: User;

//   @Column()
//   user_id: string;

//   // Relation optionnelle avec ServiceRequest
//   @ManyToOne(() => ServiceRequest, serviceRequest => serviceRequest.notifications, { nullable: true })
//   @JoinColumn({ name: 'service_request_id' })
//   serviceRequest: ServiceRequest;

//   @Column({ nullable: true })
//   service_request_id: string;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }


import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ServiceRequest } from '../../services-requests/entities/service-request.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @Column()
  type: string; // 'info', 'success', 'warning', 'error', 'document'

  @Column({ default: false })
  isRead: boolean;

  // CORRECTION: Ajouter nullable: false pour s'assurer que user_id est toujours fourni
  @ManyToOne(() => User, user => user.notifications, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false }) // CORRECTION: S'assurer que ce champ ne peut pas être null
  user_id: string;

  // CORRECTION: Relation optionnelle avec ServiceRequest
  @ManyToOne(() => ServiceRequest, serviceRequest => serviceRequest.notifications, { nullable: true })
  @JoinColumn({ name: 'service_request_id' })
  serviceRequest?: ServiceRequest;

  @Column({ nullable: true })
  service_request_id?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}