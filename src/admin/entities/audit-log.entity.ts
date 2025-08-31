import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  actionType: string; // 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'

  @Column()
  entity: string; // nom de l'entité affectée

  @Column({ nullable: true })
  entityId: string;

  @Column('json', { nullable: true })
  oldValues: Record<string, any>;

  @Column('json', { nullable: true })
  newValues: Record<string, any>;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
