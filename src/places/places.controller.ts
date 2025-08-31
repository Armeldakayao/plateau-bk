/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlacesService } from './places.dto';

@ApiTags('Places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau lieu (Admin)' })
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(createPlaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les lieux' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    return this.placesService.findAll(+page || 1, +limit || 10, type, search);
  }

  @Get('restaurants')
  @ApiOperation({ summary: 'Lister les restaurants' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findRestaurants(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.placesService.findByType('restaurant', +page || 1, +limit || 10);
  }

  @Get('landmarks')
  @ApiOperation({ summary: 'Lister les monuments' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findLandmarks(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.placesService.findByType('landmark', +page || 1, +limit || 10);
  }

  @Get('activities')
  @ApiOperation({ summary: 'Lister les activités' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findActivities(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.placesService.findByType('activity', +page || 1, +limit || 10);
  }

  @Get('hotels')
  @ApiOperation({ summary: 'Lister les hôtels' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findHotels(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.placesService.findByType('hotel', +page || 1, +limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un lieu par ID' })
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un lieu (Admin)' })
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un lieu (Admin)' })
  remove(@Param('id') id: string) {
    return this.placesService.remove(id);
  }
}
