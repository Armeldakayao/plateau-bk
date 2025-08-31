/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// /* eslint-disable prettier/prettier */
// /* eslint-disable no-constant-binary-expression */
// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Post,
//   Query,
//   UseGuards
// } from '@nestjs/common';
// // eslint-disable-next-line prettier/prettier
// import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

// import { AdminGuard } from '../auth/guards/admin.guard';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { AnnouncementsService } from './announcement.service';
// import { CreateAnnouncementDto } from './dto/create-announcement.dto';

// @ApiTags('Announcements')
// @Controller('announcements')
// export class AnnouncementsController {
//   constructor(private readonly announcementsService: AnnouncementsService) {}

//   @Post()
//   @UseGuards(JwtAuthGuard, AdminGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Créer une nouvelle annonce (Admin)' })
//   create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
//     return this.announcementsService.create(createAnnouncementDto);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Lister toutes les annonces' })
//   @ApiQuery({ name: 'page', required: false })
//   @ApiQuery({ name: 'limit', required: false })
//   @ApiQuery({ name: 'type', required: false })
//   findAll(
//     @Query('page') page?: string,
//     @Query('limit') limit?: string,
//     @Query('type') type?: string,
//   ) {
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     //@ts-ignore
//      // eslint-disable-next-line prettier/prettier
//      // eslint-disable-next-line prettier/prettier
//      return this.announcementsService.findAll(+page ?? 1, +limit ?? 10, type);
//   }

//   @Get('news')
//   @ApiOperation({ summary: 'Lister les actualités' })
//   @ApiQuery({ name: 'page', required: false })
//   @ApiQuery({ name: 'limit', required: false })
//   findNews(@Query('page') page?: string, @Query('limit') limit?: string) {
//     // eslint-disable-next-line prettier/prettier
//     return this.announcementsService.findByType('news', +page || 1, +limit || 10);
//   }

//   @Get('press-releases')
//   @ApiOperation({ summary: 'Lister les communiqués de presse' })
//   @ApiQuery({ name: 'page', required: false })
//   @ApiQuery({ name: 'limit', required: false })
//   // eslint-disable-next-line prettier/prettier
//   findPressReleases(@Query('page') page?: string, @Query('limit') limit?: string) {
//     // eslint-disable-next-line prettier/prettier
//     return this.announcementsService.findByType('press_release', +page || 1, +limit || 10);
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Obtenir une annonce par ID' })
//   findOne(@Param('id') id: string) {
//     return this.announcementsService.findOne(id);
//   }

//   // @Patch(':id')
//   // @UseGuards(JwtAuthGuard, AdminGuard)
//   // @ApiBearerAuth()
//   // @ApiOperation({ summary: 'Mettre à jour une annonce (Admin)' })
//   // update(@Param('id') id: string, @Body() updateAnnouncementDto: UpdateAnnouncementDto) {
//   //   return this.announcementsService.update(id, updateAnnouncementDto);
//   // }

//   @Delete(':id')
//   @UseGuards(JwtAuthGuard, AdminGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Supprimer une annonce (Admin)' })
//   remove(@Param('id') id: string) {
//     return this.announcementsService.remove(id);
//   }
// }
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AnnouncementsService } from './announcement.service';

@ApiTags('Communiqués / Annonces / Actualités')
@Controller('communiques')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // ============ ROUTES ADMIN ============

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau communiqué/annonce (Admin)' })
  @ApiResponse({ status: 201, description: 'Communiqué créé avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès admin requis' })
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementsService.create(createAnnouncementDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un communiqué/annonce (Admin)' })
  @ApiResponse({ status: 200, description: 'Communiqué mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Communiqué non trouvé' })
  update(@Param('id') id: string, @Body() updateAnnouncementDto: UpdateAnnouncementDto) {
    return this.announcementsService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer définitivement un communiqué (Admin)' })
  @ApiResponse({ status: 200, description: 'Communiqué supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Communiqué non trouvé' })
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Désactiver un communiqué (Admin)' })
  deactivate(@Param('id') id: string) {
    return this.announcementsService.deactivate(id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Réactiver un communiqué (Admin)' })
  activate(@Param('id') id: string) {
    return this.announcementsService.activate(id);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Statistiques des communiqués (Admin)' })
  getStats() {
    return this.announcementsService.getStats();
  }

  // ============ ROUTES PUBLIQUES ============

  @Get()
  @ApiOperation({ summary: 'Lister tous les communiqués/annonces/actualités' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'type', required: false, enum: ['news', 'press_release', 'announcement', 'communique'] })
  @ApiQuery({ name: 'search', required: false, description: 'Recherche dans titre/description' })
  @ApiQuery({ name: 'tags', required: false, description: 'Tags séparés par virgules' })
  @ApiResponse({ status: 200, description: 'Liste des communiqués récupérée avec succès' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('tags') tags?: string,
  ) {
    return this.announcementsService.findAll(
      +page || 1, 
      +limit || 10, 
      type, 
      search, 
      tags
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher dans les communiqués' })
  @ApiQuery({ name: 'q', required: true, description: 'Terme de recherche' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  search(
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.announcementsService.search(query, +page || 1, +limit || 10);
  }

  // ============ ROUTES PAR TYPE ============

  @Get('actualites')
  @ApiOperation({ summary: 'Lister les actualités (type: news)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Liste des actualités' })
  findNews(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.announcementsService.findNews(+page || 1, +limit || 10);
  }

  @Get('communiques-presse')
  @ApiOperation({ summary: 'Lister les communiqués de presse (type: press_release)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Liste des communiqués de presse' })
  findPressReleases(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.announcementsService.findPressReleases(+page || 1, +limit || 10);
  }

  @Get('communiques')
  @ApiOperation({ summary: 'Lister les communiqués municipaux (type: communique)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Liste des communiqués municipaux' })
  findCommuniques(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.announcementsService.findCommuniques(+page || 1, +limit || 10);
  }

  @Get('annonces')
  @ApiOperation({ summary: 'Lister les annonces générales (type: announcement)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Liste des annonces générales' })
  findGeneralAnnouncements(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.announcementsService.findGeneralAnnouncements(+page || 1, +limit || 10);
  }

  // ============ ROUTES SPÉCIFIQUES ============

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un communiqué/annonce par ID' })
  @ApiResponse({ status: 200, description: 'Communiqué trouvé' })
  @ApiResponse({ status: 404, description: 'Communiqué non trouvé' })
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Post(':id/comment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter un commentaire à un communiqué' })
  @ApiResponse({ status: 200, description: 'Commentaire ajouté avec succès' })
  @ApiResponse({ status: 404, description: 'Communiqué non trouvé' })
  addComment(@Param('id') id: string, @Body() addCommentDto: AddCommentDto) {
    return this.announcementsService.addComment(id, addCommentDto.comment);
  }

  // ============ ROUTES ALTERNATIVES (alias) ============

  // Routes alternatives pour la même API
  @Get('annonces/all')
  @ApiOperation({ summary: 'Alias pour lister toutes les annonces' })
  getAllAnnouncements(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
  ) {
    return this.findAll(page, limit, type);
  }

  @Get('actualites/recentes')
  @ApiOperation({ summary: 'Actualités récentes (7 derniers jours)' })
  async getRecentNews() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.announcementsService.findAll(1, 50, 'news'); // Limiter aux actualités récentes
  }
}
