import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Treatment } from './treatment.entity';

@Entity('treatment_documents')
export class TreatmentDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  nom: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  url: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @ManyToOne(() => Treatment, treatment => treatment.documentsGeneres)
  @JoinColumn({ name: 'treatment_id' })
  treatment: Treatment;

  @Column()
  treatment_id: string;

  @CreateDateColumn()
  createdAt: Date;
}