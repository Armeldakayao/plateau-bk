// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity('announcements')
// export class Announcement {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   title: string;

//   @Column('text')
//   description: string;

//   @Column('text')
//   details: string;

//   @Column('json', { nullable: true })
//   gallery: string[];

//   @Column({ type: 'date' })
//   date: Date;

//   @Column()
//   type: string; // 'news' | 'press_release' | 'announcement'

//   @Column({ nullable: true })
//   poster: string;

//   @Column('json', { nullable: true })
//   comments: string[];

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  details: string;

  @Column('json', { nullable: true })
  gallery: string[]; // URLs des images/vidéos

  @Column({ type: 'date' })
  date: Date;

  @Column()
  type: string; // 'news' | 'press_release' | 'announcement' | 'communique'

  @Column({ nullable: true })
  poster: string; // URL de l'image principale

  @Column('json', { nullable: true })
  comments: string[]; // Commentaires/réactions

  @Column({ default: true })
  isActive: boolean; // Pour activer/désactiver

  @Column({ default: 0 })
  viewCount: number; // Nombre de vues

  @Column('json', { nullable: true })
  tags: string[]; // Tags pour catégorisation

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}