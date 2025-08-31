import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ServiceRequest } from './service-request.entity';

@Entity('service_request_documents')
export class ServiceRequestDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  nom: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  url: string; // Chemin vers le fichier

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @ManyToOne(() => ServiceRequest, serviceRequest => serviceRequest.documents)
  @JoinColumn({ name: 'service_request_id' })
  serviceRequest: ServiceRequest;

  @Column()
  service_request_id: string;

  @CreateDateColumn()
  createdAt: Date;
} 