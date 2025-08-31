import { IsString, IsEmail, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Match } from '../../common/decorators/match.decorator';

export class CreateCitizenDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsDateString()
  birthDate: string;

  @ApiProperty()
  @IsString()
  residence: string;

  @ApiProperty()
  @IsString()
  idType: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  idDocument?: string; // Path vers le fichier uploadé

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  residenceProof?: string; // Path vers le fichier uploadé

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @Match('password')
  confirmPassword: string;
}
