/* eslint-disable prettier/prettier */
// admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Place } from '../places/entities/place.entity';
import { Announcement } from '../announcement/entities/announcement.entity';
import { Service } from '../services/entities/service.entity';
import { ServiceRequest } from '../services-requests/entities/service-request.entity';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Place, Announcement, Service, ServiceRequest, AuditLog]),
  ],
  providers: [AdminService],
  exports: [AdminService], // ← important pour l’utiliser ailleurs
})
export class AdminModule {}
