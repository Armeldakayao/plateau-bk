/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitizensService } from './citizens.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CitizensService],
  exports: [CitizensService], // utile si tu veux l'utiliser dans d'autres modules
})
export class CitizensModule {}
