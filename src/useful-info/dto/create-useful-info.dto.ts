import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class CreateUsefulInfoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  brochureLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  featureLink?: string;
}
