// /* eslint-disable prettier/prettier */
// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Query,
//   UseGuards,
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

// import { AdminGuard } from '../auth/guards/admin.guard';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { CreateServiceDto } from './dto/create-service.dto';
// import { UpdateServiceDto } from './dto/update-service.dto';
// import { ServicesService } from './service.service';

// @ApiTags('Services')
// @Controller('services')
// export class ServicesController {
//   constructor(private readonly servicesService: ServicesService) {}

//   @Post()
//   @UseGuards(JwtAuthGuard, AdminGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Créer un nouveau service (Admin)' })
//   create(@Body() createServiceDto: CreateServiceDto) {
//     return this.servicesService.create(createServiceDto);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Lister tous les services' })
//   @ApiQuery({ name: 'page', required: false })
//   @ApiQuery({ name: 'limit', required: false })
//   @ApiQuery({ name: 'category', required: false })
//   findAll(
//     @Query('page') page?: string,
//     @Query('limit') limit?: string,
//     @Query('category') category?: string,
//   ) {
//     return this.servicesService.findAll(+page || 1, +limit || 10, category);
//   }

//   @Get('category/:category')
//   @ApiOperation({ summary: 'Lister les services par catégorie' })
//   @ApiQuery({ name: 'page', required: false })
//   @ApiQuery({ name: 'limit', required: false })
//   findByCategory(
//     @Param('category') category: string,
//     @Query('page') page?: string,
//     @Query('limit') limit?: string,
//   ) {
//     return this.servicesService.findByCategory(category, +page || 1, +limit || 10);
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Obtenir un service par ID' })
//   findOne(@Param('id') id: string) {
//     return this.servicesService.findOne(id);
//   }

//   @Patch(':id')
//   @UseGuards(JwtAuthGuard, AdminGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Mettre à jour un service (Admin)' })
//   update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
//     return this.servicesService.update(id, updateServiceDto);
//   }

//   @Delete(':id')
//   @UseGuards(JwtAuthGuard, AdminGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Supprimer un service (Admin)' })
//   remove(@Param('id') id: string) {
//     return this.servicesService.remove(id);
//   }
// }
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
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './service.service';


@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau service (Admin)' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les services' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    return this.servicesService.findAll(+page || 1, +limit || 10, category);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Lister les services par catégorie' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findByCategory(
    @Param('category') category: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.servicesService.findByCategory(category, +page || 1, +limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un service par ID' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un service (Admin)' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un service (Admin)' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
