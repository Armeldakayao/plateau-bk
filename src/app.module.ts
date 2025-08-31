// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { getDatabaseConfig } from './config/database.config';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { PlacesModule } from './places/places.module';
// import { AnnouncementsModule } from './announcements/announcements.module';
// import { ServicesModule } from './services/services.module';
// import { ServiceRequestsModule } from './service-requests/service-requests.module';
// import { NotificationsModule } from './notifications/notifications.module';
// import { UploadModule } from './upload/upload.module';
// import { AdminModule } from './admin/admin.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     TypeOrmModule.forRootAsync({
//       inject: [ConfigService],
//       useFactory: getDatabaseConfig,
//     }),
//     AuthModule,
//     UsersModule,
//     PlacesModule,
//     AnnouncementsModule,
//     ServicesModule,
//     ServiceRequestsModule,
//     NotificationsModule,
//     UploadModule,
//     AdminModule,
//   ],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { getDatabaseConfig } from './config/database.config';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

// Modules
import { AuthModule } from './auth/auth.module';

// Controllers globaux
import { SearchController } from './common/search.controller';
import { UsersModule } from './users/user.module';
import { PlacesModule } from './places/place.module';
import { ServiceRequestsModule } from './services-requests/service-requests.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { AnnouncementsModule } from './announcement/announcement.module';
import { AdvancedServicesModule } from './services/advanced-service.module';
import { UsefulInfoModule } from './useful-info/useful-info.module';
import { CitizensModule } from './citizens/citizens.module';
import { ServicesModule } from './services/service.module';
import { SiteSettings } from './site-settings/entities/site-settings.entity';
import { SiteSettingsModule } from './site-settings/site-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
   TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: getDatabaseConfig,
}),

    AuthModule,
    UsersModule,
    PlacesModule,
    AnnouncementsModule,
    ServiceRequestsModule,
    NotificationsModule,
    UploadModule,
    AdminModule,
    AdvancedServicesModule,
    UsefulInfoModule,
    CitizensModule,
    ServicesModule,
    SiteSettingsModule,
   
  ],
  controllers: [SearchController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
