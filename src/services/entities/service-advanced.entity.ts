import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

interface AcceptedDocument {
  id: string;
  name: string;
  type: string;
  required: boolean;
  userHelp: string;
}

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  userHelp: string;
}

@Entity('advanced_services')
export class AdvancedService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column('text', { nullable: true })
  conditions: string;

  @Column('text', { nullable: true })
  confirmationMessage: string;

  @Column('json')
  acceptedDocuments: AcceptedDocument[];

  @Column('json')
  formFields: FormField[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
