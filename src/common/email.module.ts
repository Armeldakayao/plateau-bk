// src/email/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';


@Module({
  providers: [EmailService],
  exports: [EmailService], // <-- obligatoire pour l’utiliser ailleurs
})
export class EmailModule {}
