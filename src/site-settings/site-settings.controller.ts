import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SiteSettingsService } from './site-settings.service';
import { CreateSiteSettingsDto } from './dto/create-site-settings.dto';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Site Settings')
@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Obtenir les paramètres publics du site' })
  @ApiResponse({ status: 200, description: 'Paramètres publics récupérés' })
  getPublicSettings() {
    return this.siteSettingsService.getPublicSettings();
  }

  @Get('current')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les paramètres actuels (Admin)' })
  getCurrent() {
    return this.siteSettingsService.findCurrent();
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer de nouveaux paramètres (Admin)' })
  create(@Body() createSiteSettingsDto: CreateSiteSettingsDto) {
    return this.siteSettingsService.create(createSiteSettingsDto);
  }

  @Patch('current')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour les paramètres actuels (Admin)' })
  updateCurrent(@Body() updateSiteSettingsDto: UpdateSiteSettingsDto) {
    return this.siteSettingsService.updateCurrent(updateSiteSettingsDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister tous les paramètres (Admin)' })
  findAll() {
    return this.siteSettingsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir des paramètres par ID (Admin)' })
  findOne(@Param('id') id: string) {
    return this.siteSettingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour des paramètres (Admin)' })
  update(@Param('id') id: string, @Body() updateSiteSettingsDto: UpdateSiteSettingsDto) {
    return this.siteSettingsService.update(id, updateSiteSettingsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer des paramètres (Admin)' })
  remove(@Param('id') id: string) {
    return this.siteSettingsService.remove(id);
  }
}