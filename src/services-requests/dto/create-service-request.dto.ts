import { IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceRequestDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty({ example: {} })
  @IsObject()
  payload: Record<string, any>;
}
