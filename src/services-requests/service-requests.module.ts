// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ServiceRequestsService } from './service-requests.service';
// import { ServiceRequestsController } from './service-requests.controller';
// import { ServiceRequest } from './entities/service-request.entity';
// import { NotificationsModule } from '../notifications/notifications.module';

// @Module({
//   imports: [TypeOrmModule.forFeature([ServiceRequest]), NotificationsModule],
//   controllers: [ServiceRequestsController],
//   providers: [ServiceRequestsService],
//   exports: [ServiceRequestsService],
// })
// export class ServiceRequestsModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ServiceRequestsService } from './service-requests.service';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequest } from './entities/service-request.entity';
import { Treatment } from './entities/treatment.entity';

import { Service } from '../services/entities/service.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { ServiceRequestDocument } from './entities/service-request-document.entity';
import { TreatmentDocument } from './entities/treatment-document.entity';
import { EmailModule } from '../common/email.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceRequest,
      Treatment,
      ServiceRequestDocument,
      TreatmentDocument,
      Service,
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    NotificationsModule,
    EmailModule,
  ],
  controllers: [ServiceRequestsController],
  providers: [ServiceRequestsService],
  exports: [ServiceRequestsService],
})
export class ServiceRequestsModule {}