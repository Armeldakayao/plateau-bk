// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import { Announcement } from './entities/announcement.entity';
// import { AnnouncementsService } from './announcement.service';

// @Module({
//   imports: [TypeOrmModule.forFeature([Announcement])],
//   providers: [AnnouncementsService],
//   exports: [AnnouncementsService], // pour que d’autres modules puissent l’utiliser
// })
// export class AnnouncementsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Announcement } from './entities/announcement.entity';
import { AnnouncementsService } from './announcement.service';
import { AnnouncementsController } from './announcement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement])],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}