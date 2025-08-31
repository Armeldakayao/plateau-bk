import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServicesController } from './service.controller';
import { ServicesService } from './service.service';


@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServicesController], // AJOUT MANQUANT
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}