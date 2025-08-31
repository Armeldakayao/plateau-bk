// // import { IsString, IsEmail, IsOptional, IsDateString, IsNumber, IsArray, IsBoolean } from 'class-validator';
// // import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// // import { Type } from 'class-transformer';

// // export class CreateTreatmentDto {
// //   @ApiProperty()
// //   @IsString()
// //   demandeId: string;

// //   @ApiProperty()
// //   @IsString()
// //   agentNom: string;

// //   @ApiProperty()
// //   @IsString()
// //   agentPrenom: string;

// //   @ApiProperty()
// //   @IsEmail()
// //   agentEmail: string;

// //   @ApiPropertyOptional()
// //   @IsOptional()
// //   @IsString()
// //   agentService?: string;

// //   @ApiPropertyOptional()
// //   @IsOptional()
// //   @IsString()
// //   commentairesInternes?: string;

// //   @ApiPropertyOptional()
// //   @IsOptional()
// //   @IsString()
// //   messageAgent?: string;

// //   @ApiPropertyOptional()
// //   @IsOptional()
// //   @IsDateString()
// //   dateEcheance?: string;

// //   @ApiPropertyOptional()
// //   @IsOptional()
// //   @IsBoolean()
// //   notifyByEmail?: boolean;

// //   @ApiPropertyOptional()
// //   @IsOptional()
// //   @IsArray()
// //   @IsString({ each: true })
// //   documentsRequis?: string[];

// //   @ApiPropertyOptional()
// //   @IsOptional()
// //   @IsNumber()
// //   @Type(() => Number)
// //   tempsEstime?: number;
// // }
// import { IsString, IsEmail, IsOptional, IsDateString, IsNumber, IsArray, IsBoolean } from 'class-validator';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { Type } from 'class-transformer';

// export class CreateTreatmentDto {
//   @ApiProperty()
//   @IsString()
//   demandeId: string;

//   @ApiProperty()
//   @IsString()
//   agentNom: string;

//   @ApiProperty()
//   @IsString()
//   agentPrenom: string;

//   @ApiProperty()
//   @IsEmail()
//   agentEmail: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   agentService?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   commentairesInternes?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   messageAgent?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsDateString()
//   dateEcheance?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsBoolean()
//   notifyByEmail?: boolean;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   documentsRequis?: string[];

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   tempsEstime?: number;
// }



import { IsString, IsEmail, IsOptional, IsDateString, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTreatmentDto {
  @ApiProperty()
  @IsString()
  demandeId: string;

  @ApiProperty()
  @IsString()
  agentNom: string;

  @ApiProperty()
  @IsString()
  agentPrenom: string;

  @ApiProperty()
  @IsEmail()
  agentEmail: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  agentService?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  commentairesInternes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  messageAgent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateEcheance?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean) // important pour convertir "true"/"false" en boolean
  notifyByEmail?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentsRequis?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  tempsEstime?: number;
}
