import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ description: 'Type unique du service' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Titre du service' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description du service' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Icône du service' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: 'Catégorie du service' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Service actif ou non', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Documents requis', 
    type: [String],
    example: ['carte identité', 'justificatif domicile']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredDocuments?: string[];

  @ApiPropertyOptional({ 
    description: 'Configuration des champs du formulaire',
    example: [{ name: 'nom', type: 'text', required: true }]
  })
  @IsOptional()
  formFields?: any[];

  @ApiPropertyOptional({ 
    description: 'Configuration du workflow de traitement' 
  })
  @IsOptional()
  workflow?: any;
}
