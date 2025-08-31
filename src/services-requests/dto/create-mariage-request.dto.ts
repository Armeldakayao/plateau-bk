// import { IsString, IsEmail, IsDateString, IsBoolean, IsNumber, IsOptional } from 'class-validator';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { Type } from 'class-transformer';

// class ConjointDto {
//   @ApiProperty()
//   @IsString()
//   nom: string;

//   @ApiProperty()
//   @IsString()
//   prenom: string;

//   @ApiProperty()
//   @IsDateString()
//   dob: string;

//   @ApiProperty()
//   @IsString()
//   pob: string;

//   @ApiProperty()
//   @IsString()
//   nationality: string;

//   @ApiProperty()
//   @IsString()
//   profession: string;

//   @ApiProperty()
//   @IsString()
//   address: string;

//   @ApiProperty()
//   @IsString()
//   phone: string;

//   @ApiProperty()
//   @IsEmail()
//   email: string;

//   @ApiProperty()
//   @IsString()
//   idNumber: string;

//   @ApiProperty()
//   @IsString()
//   maritalStatus: string;
// }

// export class CreateMariageRequestDto {
//   @ApiProperty({ type: ConjointDto })
//   @Type(() => ConjointDto)
//   conjoint1: ConjointDto;

//   @ApiProperty({ type: ConjointDto })
//   @Type(() => ConjointDto)
//   conjoint2: ConjointDto;

//   @ApiProperty()
//   @IsString()
//   marriageType: string;

//   @ApiProperty()
//   @IsNumber()
//   guestEstimate: number;

//   @ApiProperty()
//   @IsString()
//   celebrationLanguage: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   otherCelebrationLanguage?: string;

//   @ApiProperty()
//   @IsDateString()
//   date1: string;

//   @ApiProperty()
//   @IsString()
//   time1: string;

//   @ApiProperty()
//   @IsDateString()
//   date2: string;

//   @ApiProperty()
//   @IsString()
//   time2: string;

//   @ApiProperty()
//   @IsDateString()
//   date3: string;

//   @ApiProperty()
//   @IsString()
//   time3: string;

//   @ApiProperty()
//   @IsBoolean()
//   reserveRoom: boolean;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   roomType?: string;

//   @ApiProperty()
//   @IsBoolean()
//   photoSpace: boolean;

//   @ApiProperty()
//   @IsBoolean()
//   onlinePayment: boolean;

//   @ApiProperty()
//   @IsBoolean()
//   certifyAccuracy: boolean;

//   @ApiProperty()
//   @IsBoolean()
//   authorizeContact: boolean;
// }


import { 
  IsString, IsEmail, IsDateString, IsBoolean, IsNumber, IsOptional, ValidateNested 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ConjointDto {
  @ApiProperty()
  @IsString()
  nom: string;

  @ApiProperty()
  @IsString()
  prenom: string;

  @ApiProperty()
  @IsDateString()
  dob: string;

  @ApiProperty()
  @IsString()
  pob: string;

  @ApiProperty()
  @IsString()
  nationality: string;

  @ApiProperty()
  @IsString()
  profession: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  idNumber: string;

  @ApiProperty()
  @IsString()
  maritalStatus: string;
}

export class CreateMariageRequestDto {
  @ApiProperty({ type: ConjointDto })
  @ValidateNested()
  @Type(() => ConjointDto)
  conjoint1: ConjointDto;

  @ApiProperty({ type: ConjointDto })
  @ValidateNested()
  @Type(() => ConjointDto)
  conjoint2: ConjointDto;

  @ApiProperty()
  @IsString()
  marriageType: string;

  @ApiProperty()
  @IsNumber()
  guestEstimate: number;

  @ApiProperty()
  @IsString()
  celebrationLanguage: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherCelebrationLanguage?: string;

  @ApiProperty()
  @IsDateString()
  date1: string;

  @ApiProperty()
  @IsString()
  time1: string;

  @ApiProperty()
  @IsDateString()
  date2: string;

  @ApiProperty()
  @IsString()
  time2: string;

  @ApiProperty()
  @IsDateString()
  date3: string;

  @ApiProperty()
  @IsString()
  time3: string;

  @ApiProperty()
  @IsBoolean()
  reserveRoom: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  roomType?: string;

  @ApiProperty()
  @IsBoolean()
  photoSpace: boolean;

  @ApiProperty()
  @IsBoolean()
  onlinePayment: boolean;

  @ApiProperty()
  @IsBoolean()
  certifyAccuracy: boolean;

  @ApiProperty()
  @IsBoolean()
  authorizeContact: boolean;
}
