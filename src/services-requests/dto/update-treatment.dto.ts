// // import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';
// // import { ApiPropertyOptional } from '@nestjs/swagger';
// // import { TraitementEtat, TraitementResultat } from '../entities/treatment.entity';
// // import { Type } from 'class-transformer';

// // export class UpdateTreatmentDto {
// //   @ApiPropertyOptional({ enum: TraitementEtat })
// //   @IsOptional()
// //   @IsEnum(TraitementEtat)
// //   etat?: TraitementEtat;

// //   @ApiPropertyOptional({ enum: TraitementResultat })
// //   @IsOptional()
// //   @IsEnum(TraitementResultat)
// //   resultat?: TraitementResultat;

// //   @ApiPropertyOptional()
// //   @IsOptional()
// //   @IsString()
// //   commentairesInternes?: string;

// //   @ApiPropertyOptional()
// //   @IsOptional()
// //   @IsString()
// //   commentairesPublics?: string;

// //   @ApiPropertyOptional()
// //   @IsOptional()
// //   @IsString()
// //   messageAgent?: string;

// //   @ApiPropertyOptional()
// //   @IsOptional()
// //   @IsBoolean()
// //   notifyByEmail?: boolean;

// //   @ApiPropertyOptional()
// //   @IsOptional()
// //   @IsNumber()
// //   @Type(() => Number)
// //   tempsEstime?: number;
// // }
// import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';
// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { TraitementEtat, TraitementResultat } from '../entities/treatment.entity';
// import { Type } from 'class-transformer';

// export class UpdateTreatmentDto {
//   @ApiPropertyOptional({ enum: TraitementEtat })
//   @IsOptional()
//   @IsEnum(TraitementEtat)
//   etat?: TraitementEtat;

//   @ApiPropertyOptional({ enum: TraitementResultat })
//   @IsOptional()
//   @IsEnum(TraitementResultat)
//   resultat?: TraitementResultat;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   commentairesInternes?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   commentairesPublics?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   messageAgent?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsBoolean()
//   notifyByEmail?: boolean;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   tempsEstime?: number;
// }

import { IsString, IsEmail, IsOptional, IsDateString, IsNumber, IsArray, IsBoolean, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TraitementEtat, TraitementResultat } from '../entities/treatment.entity';

export class UpdateTreatmentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TraitementEtat)
  etat?: TraitementEtat;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TraitementResultat)
  resultat?: TraitementResultat;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  etapeWorkflow?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  commentairesInternes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  commentairesPublics?: string;

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
  notifyByEmail?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notifyBySms?: boolean;

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

  // IMPORTANT: Ne pas inclure les champs de relation et les IDs
  // demandeId, demande_id, agent_id ne doivent pas être modifiables via ce DTO
}