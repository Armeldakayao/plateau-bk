
import { IsString, IsArray, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Nouveau communiqué municipal' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Description courte du communiqué...' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Détails complets du communiqué avec toutes les informations...' })
  @IsString()
  details: string;

  @ApiPropertyOptional({ 
    example: ['url1.jpg', 'url2.png'], 
    description: 'URLs des images/vidéos de la galerie' 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @ApiProperty({ example: '2024-08-17' })
  @IsDateString()
  date: string;

  @ApiProperty({ 
    enum: ['news', 'press_release', 'announcement', 'communique'],
    example: 'communique' 
  })
  @IsString()
  @IsIn(['news', 'press_release', 'announcement', 'communique'])
  type: string;

  @ApiPropertyOptional({ example: 'poster.jpg' })
  @IsOptional()
  @IsString()
  poster?: string;

  @ApiPropertyOptional({ 
    example: ['Excellente initiative !', 'Très bonne nouvelle'],
    description: 'Commentaires/réactions' 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  comments?: string[];

  @ApiPropertyOptional({ 
    example: ['urbanisme', 'transport', 'environnement'],
    description: 'Tags pour catégorisation' 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}