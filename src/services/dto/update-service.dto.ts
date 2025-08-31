// import { IsString, IsArray, IsOptional } from 'class-validator';
// import { ApiPropertyOptional } from '@nestjs/swagger';

// export class UpdateServiceDto {
//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   title?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   description?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   category?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   estimatedDuration?: string;

//   @ApiPropertyOptional({ type: [String] })
//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   conditions?: string[];

//   @ApiPropertyOptional({ type: [String] })
//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   requiredDocuments?: string[];

//   @ApiPropertyOptional({ enum: ['basic', 'advanced'] })
//   @IsOptional()
//   @IsString()
//   type?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   icon?: string;
// }
import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServiceDto {
  @ApiPropertyOptional({ description: 'Type unique du service' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Titre du service' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Description du service' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Icône du service' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: 'Catégorie du service' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Service actif ou non' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Documents requis', 
    type: [String] 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredDocuments?: string[];

  @ApiPropertyOptional({ 
    description: 'Configuration des champs du formulaire' 
  })
  @IsOptional()
  formFields?: any[];

  @ApiPropertyOptional({ 
    description: 'Configuration du workflow de traitement' 
  })
  @IsOptional()
  workflow?: any;
}