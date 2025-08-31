/* eslint-disable prettier/prettier */
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Announcement } from './entities/announcement.entity';
// import { CreateAnnouncementDto } from './dto/create-announcement.dto';
// // import { CreateAnnouncementDto } from './dto/create-announcement.dto';
// // import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

// @Injectable()
// export class AnnouncementsService {
//   constructor(
//     @InjectRepository(Announcement)
//     private announcementRepository: Repository<Announcement>,
//   ) {}

//   async create(createAnnouncementDto: CreateAnnouncementDto) {
//     // eslint-disable-next-line prettier/prettier
//     const announcement = this.announcementRepository.create(createAnnouncementDto);
//     return this.announcementRepository.save(announcement);
//   }

//   async findAll(page: number = 1, limit: number = 10, type?: string) {
//     // eslint-disable-next-line prettier/prettier
//     const queryBuilder = this.announcementRepository.createQueryBuilder('announcement');

//     if (type) {
//       queryBuilder.where('announcement.type = :type', { type });
//     }

//     queryBuilder.orderBy('announcement.date', 'DESC');

//     const [announcements, total] = await queryBuilder
//       .skip((page - 1) * limit)
//       .take(limit)
//       .getManyAndCount();

//     return {
//       data: announcements,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }

//   async findOne(id: string) {
//     const announcement = await this.announcementRepository.findOne({
//       where: { id },
//     });

//     if (!announcement) {
//       throw new NotFoundException('Annonce non trouvée');
//     }

//     return announcement;
//   }

//   // async update(id: string, updateAnnouncementDto: UpdateAnnouncementDto) {
//   //   const announcement = await this.findOne(id);
//   //   Object.assign(announcement, updateAnnouncementDto);
//   //   return this.announcementRepository.save(announcement);
//   // }

//   async remove(id: string) {
//     const announcement = await this.findOne(id);
//     return this.announcementRepository.remove(announcement);
//   }

//   async findByType(type: string, page: number = 1, limit: number = 10) {
//     return this.findAll(page, limit, type);
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto) {
    const announcement = this.announcementRepository.create({
      ...createAnnouncementDto,
      date: new Date(createAnnouncementDto.date),
      viewCount: 0,
      isActive: true,
    });
    return this.announcementRepository.save(announcement);
  }

  async findAll(
    page: number = 1, 
    limit: number = 10, 
    type?: string, 
    search?: string,
    tags?: string,
    isActive: boolean = true
  ) {
    const queryBuilder = this.announcementRepository.createQueryBuilder('announcement');

    // Filtrer par statut actif par défaut
    queryBuilder.where('announcement.isActive = :isActive', { isActive });

    // Filtrer par type
    if (type) {
      queryBuilder.andWhere('announcement.type = :type', { type });
    }

    // Recherche textuelle
    if (search) {
      queryBuilder.andWhere(
        '(announcement.title LIKE :search OR announcement.description LIKE :search OR announcement.details LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Filtrer par tags
    if (tags) {
      const tagArray = tags.split(',');
      queryBuilder.andWhere('JSON_OVERLAPS(announcement.tags, :tags)', { 
        tags: JSON.stringify(tagArray) 
      });
    }

    // Trier par date décroissante
    queryBuilder.orderBy('announcement.date', 'DESC');

    const [announcements, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: announcements,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const announcement = await this.announcementRepository.findOne({
      where: { id, isActive: true }
    });

    if (!announcement) {
      throw new NotFoundException('Communiqué non trouvé');
    }

    // Incrémenter le compteur de vues
    announcement.viewCount += 1;
    await this.announcementRepository.save(announcement);

    return announcement;
  }

  async update(id: string, updateAnnouncementDto: UpdateAnnouncementDto) {
    const announcement = await this.findOne(id);
    
    // Si la date est fournie, la convertir
    if (updateAnnouncementDto.date) {
      updateAnnouncementDto.date = new Date(updateAnnouncementDto.date) as any;
    }
    
    Object.assign(announcement, updateAnnouncementDto);
    return this.announcementRepository.save(announcement);
  }

  async remove(id: string) {
    const announcement = await this.announcementRepository.findOne({
      where: { id }
    });

    if (!announcement) {
      throw new NotFoundException('Communiqué non trouvé');
    }

    return this.announcementRepository.remove(announcement);
  }

  // Soft delete - marquer comme inactif au lieu de supprimer
  async deactivate(id: string) {
    const announcement = await this.findOne(id);
    announcement.isActive = false;
    return this.announcementRepository.save(announcement);
  }

  // Réactiver un communiqué
  async activate(id: string) {
    const announcement = await this.announcementRepository.findOne({
      where: { id }
    });

    if (!announcement) {
      throw new NotFoundException('Communiqué non trouvé');
    }

    announcement.isActive = true;
    return this.announcementRepository.save(announcement);
  }

  // Ajouter un commentaire
  async addComment(id: string, comment: string) {
    const announcement = await this.findOne(id);
    
    if (!announcement.comments) {
      announcement.comments = [];
    }
    
    announcement.comments.push(comment);
    return this.announcementRepository.save(announcement);
  }

  // Méthodes spécifiques par type
  async findByType(type: string, page: number = 1, limit: number = 10) {
    return this.findAll(page, limit, type);
  }

  async findNews(page: number = 1, limit: number = 10) {
    return this.findByType('news', page, limit);
  }

  async findPressReleases(page: number = 1, limit: number = 10) {
    return this.findByType('press_release', page, limit);
  }

  async findCommuniques(page: number = 1, limit: number = 10) {
    return this.findByType('communique', page, limit);
  }

  async findGeneralAnnouncements(page: number = 1, limit: number = 10) {
    return this.findByType('announcement', page, limit);
  }

  // Statistiques pour admin
  async getStats() {
    const [
      total,
      totalNews,
      totalPressReleases,
      totalCommuniques,
      totalGeneralAnnouncements,
      recentCount,
    ] = await Promise.all([
      this.announcementRepository.count({ where: { isActive: true } }),
      this.announcementRepository.count({ where: { type: 'news', isActive: true } }),
      this.announcementRepository.count({ where: { type: 'press_release', isActive: true } }),
      this.announcementRepository.count({ where: { type: 'communique', isActive: true } }),
      this.announcementRepository.count({ where: { type: 'announcement', isActive: true } }),
      this.announcementRepository.count({
        where: {
          isActive: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 derniers jours
        },
      }),
    ]);

    return {
      total,
      byType: {
        news: totalNews,
        pressReleases: totalPressReleases,
        communiques: totalCommuniques,
        generalAnnouncements: totalGeneralAnnouncements,
      },
      recentCount,
    };
  }

  // Recherche avancée
  async search(query: string, page: number = 1, limit: number = 10) {
    return this.findAll(page, limit, undefined, query);
  }
}