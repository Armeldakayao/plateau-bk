/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUsefulInfoDto } from './dto/create-useful-info.dto';
import { UsefulInfoService } from './useful-info.service';
// import { UpdateUsefulInfoDto } from './dto/update-useful-info.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Useful Info')
@Controller('useful-info')
export class UsefulInfoController {
  constructor(private readonly usefulInfoService: UsefulInfoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une information utile (Admin)' })
  create(@Body() createUsefulInfoDto: CreateUsefulInfoDto) {
    return this.usefulInfoService.create(createUsefulInfoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les informations utiles' })
  findAll() {
    return this.usefulInfoService.findAll();
  }

  @Get('latest')
  @ApiOperation({ summary: 'Obtenir la dernière information utile' })
  getLatest() {
    return this.usefulInfoService.getLatest();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une information utile par ID' })
  findOne(@Param('id') id: string) {
    return this.usefulInfoService.findOne(id);
  }


//   @Patch(':id')
//   @UseGuards(JwtAuthGuard, AdminGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Mettre à jour une information utile (Admin)' })
//   update(@Param('id') id: string, @Body() updateUsefulInfoDto: UpdateUsefulInfoDto) {
//     return this.usefulInfoService.update(id, updateUsefulInfoDto);
//   }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une information utile (Admin)' })
  remove(@Param('id') id: string) {
    return this.usefulInfoService.remove(id);
  }
}
