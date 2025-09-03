// // import { Injectable, NotFoundException } from '@nestjs/common';
// // import { InjectRepository } from '@nestjs/typeorm';
// // import { Repository } from 'typeorm';
// // import { Notification } from './entities/notification.entity';
// // import { CreateNotificationDto } from './dto/create-notification.dto';

// // @Injectable()
// // export class NotificationsService {
// //   constructor(
// //     @InjectRepository(Notification)
// //     private notificationRepository: Repository<Notification>,
// //   ) {}

// //   async create(createNotificationDto: CreateNotificationDto) {
// //     const notification = this.notificationRepository.create(createNotificationDto);
// //     return this.notificationRepository.save(notification);
// //   }

// //   async findByUser(userId: string, page: number = 1, limit: number = 10) {
// //     const [notifications, total] = await this.notificationRepository.findAndCount({
// //       where: { userId },
// //       skip: (page - 1) * limit,
// //       take: limit,
// //       order: { createdAt: 'DESC' },
// //     });

// //     return {
// //       data: notifications,
// //       total,
// //       page,
// //       limit,
// //       totalPages: Math.ceil(total / limit),
// //       unreadCount: notifications.filter((n) => !n.isRead).length,
// //     };
// //   }

// //   async markAsRead(id: string, userId: string) {
// //     const notification = await this.notificationRepository.findOne({
// //       where: { id, userId },
// //     });

// //     if (!notification) {
// //       throw new NotFoundException('Notification non trouvée');
// //     }

// //     notification.isRead = true;
// //     return this.notificationRepository.save(notification);
// //   }

// //   async markAllAsRead(userId: string) {
// //     await this.notificationRepository.update({ userId, isRead: false }, { isRead: true });

// //     return { message: 'Toutes les notifications ont été marquées comme lues' };
// //   }

// //   async getUnreadCount(userId: string) {
// //     const count = await this.notificationRepository.count({
// //       where: { userId, isRead: false },
// //     });

// //     return { unreadCount: count };
// //   }

// //   async remove(id: string, userId: string) {
// //     const notification = await this.notificationRepository.findOne({
// //       where: { id, userId },
// //     });

// //     if (!notification) {
// //       throw new NotFoundException('Notification non trouvée');
// //     }

// //     return this.notificationRepository.remove(notification);
// //   }

// //   // Méthodes utilitaires pour créer des notifications spécifiques
// //   async notifyServiceRequestUpdate(userId: string, requestType: string, status: string) {
// //     return this.create({
// //       userId,
// //       message: `Votre demande "${requestType}" a été ${status}`,
// //       type: status === 'completed' ? 'success' : status === 'rejected' ? 'error' : 'info',
// //     });
// //   }

// //   async notifyNewAnnouncement(userId: string, announcementTitle: string) {
// //     return this.create({
// //       userId,
// //       message: `Nouvelle annonce : ${announcementTitle}`,
// //       type: 'info',
// //     });
// //   }
// // }
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Notification } from './entities/notification.entity';
// import { CreateNotificationDto } from './dto/create-notification.dto';

// @Injectable()
// export class NotificationsService {
//   constructor(
//     @InjectRepository(Notification)
//     private notificationRepository: Repository<Notification>,
//   ) {}

//   async create(createNotificationDto: CreateNotificationDto) {
//     const notification = this.notificationRepository.create(createNotificationDto);
//     return this.notificationRepository.save(notification);
//   }

//   async findByUser(userId: string, page: number = 1, limit: number = 10) {
//     const [notifications, total] = await this.notificationRepository.findAndCount({
//       where: { user: { id: userId } },
//       skip: (page - 1) * limit,
//       take: limit,
//       order: { createdAt: 'DESC' },
//     });

//     return {
//       data: notifications,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//       unreadCount: notifications.filter((n) => !n.isRead).length,
//     };
//   }

//   async markAsRead(id: string, userId: string) {
//     const notification = await this.notificationRepository.findOne({
//       where: { id, user: { id: userId } },
//     });

//     if (!notification) {
//       throw new NotFoundException('Notification non trouvée');
//     }

//     notification.isRead = true;
//     return this.notificationRepository.save(notification);
//   }

//   async markAllAsRead(userId: string) {
//     await this.notificationRepository.update(
//       { user: { id: userId }, isRead: false }, 
//       { isRead: true }
//     );

//     return { message: 'Toutes les notifications ont été marquées comme lues' };
//   }

//   async getUnreadCount(userId: string) {
//     const count = await this.notificationRepository.count({
//       where: { user: { id: userId }, isRead: false },
//     });

//     return { unreadCount: count };
//   }

//   async remove(id: string, userId: string) {
//     const notification = await this.notificationRepository.findOne({
//       where: { id, user: { id: userId } },
//     });

//     if (!notification) {
//       throw new NotFoundException('Notification non trouvée');
//     }

//     return this.notificationRepository.remove(notification);
//   }

//   // Méthodes utilitaires pour créer des notifications spécifiques
//   async notifyServiceRequestUpdate(userId: string, requestType: string, status: string) {
//     return this.create({
//       userId,
//       message: `Votre demande "${requestType}" a été ${status}`,
//       type: status === 'completed' ? 'success' : status === 'rejected' ? 'error' : 'info',
//     });
//   }

//   async notifyNewAnnouncement(userId: string, announcementTitle: string) {
//     return this.create({
//       userId,
//       message: `Nouvelle annonce : ${announcementTitle}`,
//       type: 'info',
//     });
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    // CORRECTION: Créer la notification avec les bons noms de propriétés
    const notification = this.notificationRepository.create({
      message: createNotificationDto.message,
      type: createNotificationDto.type,
      user_id: createNotificationDto.userId, // CORRECTION: Mapper userId vers user_id
      service_request_id: createNotificationDto.serviceRequestId, // CORRECTION: Mapper serviceRequestId vers service_request_id
      isRead: false, // CORRECTION: Définir explicitement isRead
     // CORRECTION: Ajouter la relation si nécessaire
    });
    
    return this.notificationRepository.save(notification);
  }

  async findByUser(userId: string, page: number = 1, limit: number = 10) {
    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: { user_id: userId }, // CORRECTION: Utiliser user_id au lieu de user: { id: userId }
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['serviceRequest'], // CORRECTION: Charger la relation si nécessaire
    });

    return {
      data: notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      unreadCount: notifications.filter((n) => !n.isRead).length,
    };
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id, user_id: userId }, // CORRECTION: Utiliser user_id
    });

    if (!notification) {
      throw new NotFoundException('Notification non trouvée');
    }

    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepository.update(
      { user_id: userId, isRead: false }, // CORRECTION: Utiliser user_id
      { isRead: true }
    );

    return { message: 'Toutes les notifications ont été marquées comme lues' };
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationRepository.count({
      where: { user_id: userId, isRead: false }, // CORRECTION: Utiliser user_id
    });

    return { unreadCount: count };
  }

  async remove(id: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id, user_id: userId }, // CORRECTION: Utiliser user_id
    });

    if (!notification) {
      throw new NotFoundException('Notification non trouvée');
    }

    return this.notificationRepository.remove(notification);
  }

  // Méthodes utilitaires pour créer des notifications spécifiques
  async notifyServiceRequestUpdate(userId: string, requestType: string, status: string) {
    return this.create({
      userId,
      message: `Votre demande "${requestType}" a été ${status}`,
      type: status === 'completed' ? 'success' : status === 'rejected' ? 'error' : 'info',
    });
  }

  async notifyNewAnnouncement(userId: string, announcementTitle: string) {
    return this.create({
      userId,
      message: `Nouvelle annonce : ${announcementTitle}`,
      type: 'info',
    });
  }
}