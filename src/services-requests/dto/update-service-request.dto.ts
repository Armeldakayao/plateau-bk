import { IsString, IsObject, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServiceRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: {} })
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;
}
