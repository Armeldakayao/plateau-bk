// src/auth/dto/verify-login-otp.dto.ts
import { IsString, Length, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyLoginOtpDto {
  @ApiProperty({ example: '123456', description: 'Code OTP à 6 chiffres' })
  @IsString()
  @Length(6, 6, { message: 'Le code OTP doit contenir exactement 6 chiffres' })
  code: string;

  @ApiProperty({ description: 'ID de l\'utilisateur qui tente de se connecter' })
  @IsUUID('4', { message: 'ID utilisateur invalide' })
  userId: string;
}