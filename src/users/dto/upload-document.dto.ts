import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentType } from '../entities/user-document.entity';

export class UploadDocumentDto {
  @ApiProperty({
    enum: DocumentType,
    description: 'Type de document',
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiPropertyOptional({
    description: 'Description du document',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDocumentDto {
  @ApiPropertyOptional({
    enum: DocumentType,
    description: 'Type de document',
  })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiPropertyOptional({
    description: 'Description du document',
  })
  @IsOptional()
  @IsString()
  description?: string;
}