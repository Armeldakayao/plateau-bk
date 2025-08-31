import { IsString, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginOtpDto {
  @ApiProperty({ 
    example: 'user@example.com',
    description: 'Email de l\'utilisateur'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: '123456',
    description: 'Code OTP reçu par email'
  })
  @IsString()
  @Length(6, 6, { message: 'Le code OTP doit contenir exactement 6 chiffres' })
  otpCode: string;
}