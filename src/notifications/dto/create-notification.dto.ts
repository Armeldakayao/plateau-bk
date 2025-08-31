import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty({ enum: ['info', 'warning', 'success', 'error', 'document'] })
  @IsString()
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  serviceRequestId?: string;
}
