import { IsString, IsEmail, IsNumber, IsDateString, IsBoolean, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePartenariatRequestDto {
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
  organizationName: string;

  @ApiProperty()
  @IsString()
  organizationType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherOrganizationType?: string;

  @ApiProperty()
  @IsString()
  activitySector: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherActivitySector?: string;

  @ApiProperty()
  @IsString()
  originCountry: string;

  @ApiProperty()
  @IsString()
  originCity: string;

  @ApiProperty()
  @IsNumber()
  creationYear: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty()
  @IsString()
  contactName: string;

  @ApiProperty()
  @IsString()
  contactFunction: string;

  @ApiProperty()
  @IsString()
  contactPhone: string;

  @ApiProperty()
  @IsEmail()
  contactEmail: string;

  @ApiProperty()
  @IsString()
  partnershipNature: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherPartnershipNature?: string;

  @ApiProperty()
  @IsString()
  concernedService: string;

  @ApiProperty()
  @IsString()
  proposalDescription: string;

  @ApiProperty()
  @IsString()
  mairieObjectives: string;

  @ApiProperty()
  @IsString()
  structureObjectives: string;

  @ApiProperty()
  @IsString()
  partnershipDuration: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsBoolean()
  certifyAccuracy: boolean;

  @ApiProperty()
  @IsBoolean()
  authorizeContact: boolean;

  @ApiProperty()
  @IsBoolean()
  acknowledgeNoValidation: boolean;
}