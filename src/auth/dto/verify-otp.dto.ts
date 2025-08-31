import { IsString, Length, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ 
    example: '123456',
    description: 'Code OTP à 6 chiffres reçu par email'
  })
  @IsString()
  @Length(6, 6, { message: 'Le code OTP doit contenir exactement 6 chiffres' })
  code: string;

  @ApiProperty({ 
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID de l\'utilisateur'
  })
  @IsUUID('4', { message: 'Format d\'ID utilisateur invalide' })
  userId: string;
}