import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('site_settings')
export class SiteSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Mon Application Citoyenne' })
  siteName: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  favicon: string;

  @Column({ default: '#3B82F6' })
  primaryColor: string;

  @Column({ default: '#1E40AF' })
  secondaryColor: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  youtube: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  welcomeMessage: string;

  @Column({ type: 'text', nullable: true })
  footerText: string;

  @Column({ type: 'json', nullable: true })
  businessHours: Record<string, { open: string; close: string; isOpen: boolean }>;

  @Column({ default: 'fr' })
  defaultLanguage: string;

 @Column({ type: 'json', nullable: true })
  supportedLanguages: string[];


  @Column({ default: 'Europe/Paris' })
  timezone: string;

  @Column({ default: 'EUR' })
  currency: string;

  @Column({ default: true })
  allowRegistration: boolean;

  @Column({ default: true })
  requireEmailVerification: boolean;

  @Column({ default: false })
  maintenanceMode: boolean;

  @Column({ type: 'text', nullable: true })
  maintenanceMessage: string;

  @Column({ type: 'json', nullable: true })
  emergencyContacts: Array<{
    name: string;
    phone: string;
    service: string;
    available24h: boolean;
  }>;

  @Column({ type: 'json', nullable: true })
  importantLinks: Array<{
    title: string;
    url: string;
    description: string;
    icon?: string;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}