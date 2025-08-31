// /* eslint-disable prettier/prettier */
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../users/entities/user.entity';
// import { Place } from '../places/entities/place.entity';
// // import { Announcement } from '../announcements/entities/announcement.entity';
// import { Service } from '../services/entities/service.entity';
// // import { ServiceRequest } from '../service-requests/entities/service-request.entity';
// import { AuditLog } from './entities/audit-log.entity';
// import { Announcement } from '../announcement/entities/announcement.entity';
// import { ServiceRequest } from '../services-requests/entities/service-request.entity';

// @Injectable()
// export class AdminService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     @InjectRepository(Place)
//     private placeRepository: Repository<Place>,
//     @InjectRepository(Announcement)
//     private announcementRepository: Repository<Announcement>,
//     @InjectRepository(Service)
//     private serviceRepository: Repository<Service>,
//     @InjectRepository(ServiceRequest)
//     private serviceRequestRepository: Repository<ServiceRequest>,
//     @InjectRepository(AuditLog)
//     private auditLogRepository: Repository<AuditLog>,
//   ) {}

//   async getDashboardStats() {
//     const [
//       totalUsers,
//       totalPlaces,
//       totalAnnouncements,
//       totalServices,
//       pendingRequests,
//       completedRequests,
//       recentUsers,
//       recentRequests,
//     ] = await Promise.all([
//       this.userRepository.count(),
//       this.placeRepository.count(),
//       this.announcementRepository.count(),
//       this.serviceRepository.count(),
//       this.serviceRequestRepository.count({ where: { etat: 'en_attente' } }),
// this.serviceRequestRepository.count({ where: { etat: 'validee' } }),
//       this.userRepository.count({
//         where: {
//           createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 derniers jours
//         },
//       }),
//       this.serviceRequestRepository.count({
//         where: {
//           createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 derniers jours
//         },
//       }),
//     ]);

//     return {
//       stats: {
//         totalUsers,
//         totalPlaces,
//         totalAnnouncements,
//         totalServices,
//         pendingRequests,
//         completedRequests,
//         recentUsers,
//         recentRequests,
//       },
//       metrics: {
//         userGrowthRate: await this.calculateUserGrowthRate(),
//         requestCompletionRate:
//           (completedRequests / (completedRequests + pendingRequests)) * 100 || 0,
//       },
//     };
//   }

//   private async calculateUserGrowthRate(): Promise<number> {
//     const now = new Date();
//     const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
//     const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

//     const [currentMonthUsers, lastMonthUsers] = await Promise.all([
//       this.userRepository.count({
//         where: {
//           createdAt: new Date(lastMonth.getTime()),
//         },
//       }),
//       this.userRepository.count({
//         where: {
//           createdAt: new Date(twoMonthsAgo.getTime()),
//         },
//       }),
//     ]);

//     if (lastMonthUsers === 0) return 0;
//     return ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;
//   }

//   async getAuditLogs(page: number = 1, limit: number = 20, userId?: string, actionType?: string) {
//     const queryBuilder = this.auditLogRepository
//       .createQueryBuilder('log')
//       .leftJoinAndSelect('log.user', 'user');

//     if (userId) {
//       queryBuilder.andWhere('log.userId = :userId', { userId });
//     }

//     if (actionType) {
//       queryBuilder.andWhere('log.actionType = :actionType', { actionType });
//     }

//     queryBuilder.orderBy('log.createdAt', 'DESC');

//     const [logs, total] = await queryBuilder
//       .skip((page - 1) * limit)
//       .take(limit)
//       .getManyAndCount();

//     return {
//       data: logs,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }

//   async createAuditLog(
//     actionType: string,
//     entity: string,
//     entityId?: string,
//     userId?: string,
//     oldValues?: Record<string, any>,
//     newValues?: Record<string, any>,
//     ipAddress?: string,
//     userAgent?: string,
//   ) {
//     const auditLog = this.auditLogRepository.create({
//       actionType,
//       entity,
//       entityId,
//       userId,
//       oldValues,
//       newValues,
//       ipAddress,
//       userAgent,
//     });

//     return this.auditLogRepository.save(auditLog);
//   }
// }
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Place } from '../places/entities/place.entity';
// import { Announcement } from '../announcements/entities/announcement.entity';
import { Service } from '../services/entities/service.entity';
// import { ServiceRequest } from '../service-requests/entities/service-request.entity';
import { AuditLog } from './entities/audit-log.entity';
import { Announcement } from '../announcement/entities/announcement.entity';
import { DemandeEtat, ServiceRequest } from '../services-requests/entities/service-request.entity';


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalPlaces,
      totalAnnouncements,
      totalServices,
      pendingRequests,
      completedRequests,
      recentUsers,
      recentRequests,
    ] = await Promise.all([
      this.userRepository.count(),
      this.placeRepository.count(),
      this.announcementRepository.count(),
      this.serviceRepository.count(),
      this.serviceRequestRepository.count({ where: { etat: DemandeEtat.EN_ATTENTE } }),
      this.serviceRequestRepository.count({ where: { etat: DemandeEtat.VALIDEE } }),
      this.userRepository.count({
        where: {
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 derniers jours
        },
      }),
      this.serviceRequestRepository.count({
        where: {
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 derniers jours
        },
      }),
    ]);

    return {
      stats: {
        totalUsers,
        totalPlaces,
        totalAnnouncements,
        totalServices,
        pendingRequests,
        completedRequests,
        recentUsers,
        recentRequests,
      },
      metrics: {
        userGrowthRate: await this.calculateUserGrowthRate(),
        requestCompletionRate:
          (completedRequests / (completedRequests + pendingRequests)) * 100 || 0,
      },
    };
  }

  private async calculateUserGrowthRate(): Promise<number> {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

    const [currentMonthUsers, lastMonthUsers] = await Promise.all([
      this.userRepository.count({
        where: {
          createdAt: new Date(lastMonth.getTime()),
        },
      }),
      this.userRepository.count({
        where: {
          createdAt: new Date(twoMonthsAgo.getTime()),
        },
      }),
    ]);

    if (lastMonthUsers === 0) return 0;
    return ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;
  }

  async getAuditLogs(page: number = 1, limit: number = 20, userId?: string, actionType?: string) {
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user');

    if (userId) {
      queryBuilder.andWhere('log.userId = :userId', { userId });
    }

    if (actionType) {
      queryBuilder.andWhere('log.actionType = :actionType', { actionType });
    }

    queryBuilder.orderBy('log.createdAt', 'DESC');

    const [logs, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createAuditLog(
    actionType: string,
    entity: string,
    entityId?: string,
    userId?: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const auditLog = this.auditLogRepository.create({
      actionType,
      entity,
      entityId,
      userId,
      oldValues,
      newValues,
      ipAddress,
      userAgent,
    });

    return this.auditLogRepository.save(auditLog);
  }
}