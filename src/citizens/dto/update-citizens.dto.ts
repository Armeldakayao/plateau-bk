import { PartialType } from '@nestjs/swagger';

import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCitizenDto } from './create-citizens.dto';

export class UpdateCitizenDto extends PartialType(CreateCitizenDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}