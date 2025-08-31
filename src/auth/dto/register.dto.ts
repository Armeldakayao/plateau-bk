// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsBoolean,
//   IsDateString,
//   IsEmail,
//   IsString,
//   // eslint-disable-next-line prettier/prettier
//   MinLength
// } from 'class-validator';
// import { Match } from '../../common/decorators/match.decorator';

// export class RegisterDto {
//   @ApiProperty()
//   @IsString()
//   firstName: string;

//   @ApiProperty()
//   @IsString()
//   lastName: string;

//   @ApiProperty()
//   @IsDateString()
//   birthDate: string;

//   @ApiProperty()
//   @IsString()
//   birthPlace: string;

//   @ApiProperty()
//   @IsString()
//   nationality: string;

//   @ApiProperty()
//   @IsString()
//   city: string;

//   @ApiProperty()
//   @IsEmail()
//   email: string;

//   @ApiProperty()
//   @IsString()
//   phone: string;

//   @ApiProperty()
//   @IsString()
//   @MinLength(6)
//   password: string;

//   @ApiProperty()
//   @IsString()
//   @Match('password', { message: 'Les mots de passe ne correspondent pas' })
//   confirmPassword: string;

//   @ApiProperty()
//   @IsString()
//   idType: string;

//   @ApiProperty()
//   @IsString()
//   idNumber: string;

//   @ApiProperty()
//   @IsBoolean()
//   acceptTerms: boolean;

//   @ApiProperty()
//   @IsBoolean()
//   acceptDataPolicy: boolean;
// }
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export class RegisterDto {
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
  birthPlace: string;

  @ApiProperty()
  @IsString()
  nationality: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  @Match('password', { message: 'Les mots de passe ne correspondent pas' })
  confirmPassword: string;

  @ApiProperty()
  @IsString()
  idType: string;

  @ApiProperty()
  @IsString()
  idNumber: string;

  @ApiProperty()
  @IsBoolean()
  acceptTerms: boolean;

  @ApiProperty()
  @IsBoolean()
  acceptDataPolicy: boolean;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.USER,
    description: 'Rôle de l\'utilisateur',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}