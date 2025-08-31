import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCommentDto {
  @ApiProperty({ example: 'Excellent communiqué, merci pour ces informations !' })
  @IsString()
  comment: string;
}