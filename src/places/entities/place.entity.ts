import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('places')
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  details: string;

  @Column('json', { nullable: true })
  gallery: string[];

  @Column('json', { nullable: true })
  reviews: string[];

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  @Column()
  address: string;

  @Column('json', { nullable: true })
  features: string[];

  @Column('json', { nullable: true })
  specialties: string[];

  @Column({ nullable: true })
  openingHours: string;

  @Column({ nullable: true })
  poster: string;

  @Column({ default: 'restaurant' })
  type: string; // 'restaurant' | 'landmark' | 'activity' | 'hotel'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
