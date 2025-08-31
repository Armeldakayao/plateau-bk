/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsefulInfoService } from './useful-info.service';
import { UsefulInfo } from '../common/entities/useful-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsefulInfo])],
  providers: [UsefulInfoService],
  exports: [UsefulInfoService], // pour l'utiliser ailleurs
})
export class UsefulInfoModule {}
