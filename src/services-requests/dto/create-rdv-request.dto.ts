import { IsString, IsEmail, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRdvRequestDto {
  @ApiProperty()
  @IsString()
  nom: string;

  @ApiProperty()
  @IsString()
  prenom: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  telephone: string;

  @ApiProperty()
  @IsString()
  profession: string;

  @ApiProperty()
  @IsString()
  institution: string;

  @ApiProperty()
  @IsString()
  nationalId: string;

  @ApiProperty()
  @IsString()
  meetingTarget: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherMeetingTarget?: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherSubject?: string;

  @ApiProperty()
  @IsDateString()
  preferredSlot1: string;

  @ApiProperty()
  @IsDateString()
  preferredSlot2: string;

  @ApiProperty()
  @IsDateString()
  preferredSlot3: string;

  @ApiProperty()
  @IsString()
  meetingType: string;

  @ApiProperty()
  @IsBoolean()
  certifyAccuracy: boolean;

  @ApiProperty()
  @IsBoolean()
  authorizeContact: boolean;
}