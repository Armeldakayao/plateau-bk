/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PlacesService } from '../places/places.dto';
import { AnnouncementsService } from '../announcement/announcement.service';
import { ServicesService } from '../services/service.service';


@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private placesService: PlacesService,
    private announcementsService: AnnouncementsService,
    private servicesService: ServicesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Recherche globale' })
  @ApiQuery({ name: 'query', required: true })
  @ApiQuery({ name: 'type', required: false })
  async globalSearch(@Query('query') query: string, @Query('type') type?: string) {
    const results = {
      places: [],
      announcements: [],
      services: [],
    };

    if (!type || type === 'places') {
      const placesResult = await this.placesService.findAll(1, 5, undefined, query);
      results.places = placesResult.data;
    }

    if (!type || type === 'announcements') {
      const announcementsResult = await this.announcementsService.findAll(1, 5);
      results.announcements = announcementsResult.data.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (!type || type === 'services') {
      const servicesResult = await this.servicesService.findAll(1, 5);
      results.services = servicesResult.data.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.description.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase()),
      );
    }

    return {
      query,
      results,
      total: results.places.length + results.announcements.length + results.services.length,
    };
  }
}
