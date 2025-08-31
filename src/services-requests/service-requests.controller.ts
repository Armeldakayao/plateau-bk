// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
//   Request,
//   UseGuards,
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { CreateServiceRequestDto } from './dto/create-service-request.dto';
// import { ServiceRequestsService } from './service-requests.service';

// import { AdminGuard } from '../auth/guards/admin.guard';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { UpdateServiceRequestDto } from './dto/update-service-request.dto';

// @ApiTags('Service Requests')
// @Controller('service-requests')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
// export class ServiceRequestsController {
//   constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

//   @Post()
//   @ApiOperation({ summary: 'Créer une nouvelle demande de service' })
//   create(@Body() createServiceRequestDto: CreateServiceRequestDto, @Request() req) {
//     return this.serviceRequestsService.create(createServiceRequestDto, req.user.id);
//   }

//   @Get()
//   @UseGuards(AdminGuard)
//   @ApiOperation({ summary: 'Lister toutes les demandes (Admin)' })
//   @ApiQuery({ name: 'page', required: false })
//   @ApiQuery({ name: 'limit', required: false })
//   @ApiQuery({ name: 'status', required: false })
//   findAll(
//     @Query('page') page?: string,
//     @Query('limit') limit?: string,
//     @Query('status') status?: string,
//   ) {
//     return this.serviceRequestsService.findAll(+page || 1, +limit || 10, status);
//   }

//   @Get('my-requests')
//   @ApiOperation({ summary: 'Lister mes demandes de service' })
//   @ApiQuery({ name: 'page', required: false })
//   @ApiQuery({ name: 'limit', required: false })
//   findMyRequests(@Request() req, @Query('page') page?: string, @Query('limit') limit?: string) {
//     return this.serviceRequestsService.findByUser(req.user.id, +page || 1, +limit || 10);
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Obtenir une demande par ID' })
//   findOne(@Param('id') id: string, @Request() req) {
//     const userId = req.user.role === 'admin' ? undefined : req.user.id;
//     return this.serviceRequestsService.findOne(id, userId);
//   }

//   @Patch(':id')
//   @UseGuards(AdminGuard)
//   @ApiOperation({ summary: 'Mettre à jour une demande (Admin)' })
//   update(@Param('id') id: string, @Body() updateServiceRequestDto: UpdateServiceRequestDto) {
//     return this.serviceRequestsService.update(id, updateServiceRequestDto);
//   }

//   @Patch(':id/status')
//   @UseGuards(AdminGuard)
//   @ApiOperation({ summary: "Mettre à jour le statut d'une demande (Admin)" })
//   updateStatus(@Param('id') id: string, @Body() body: { status: string; adminNotes?: string }) {
//     return this.serviceRequestsService.updateStatus(id, body.status, body.adminNotes);
//   }

//   @Delete(':id')
//   @UseGuards(AdminGuard)
//   @ApiOperation({ summary: 'Supprimer une demande (Admin)' })
//   remove(@Param('id') id: string) {
//     return this.serviceRequestsService.remove(id);
//   }
// }
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Query, 
  UseGuards, 
  Request,
  UseInterceptors,
  UploadedFiles,
  ParseUUIDPipe,
  BadRequestException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery, 
  ApiConsumes 
} from '@nestjs/swagger';
import { ServiceRequestsService } from './service-requests.service';

import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateRdvRequestDto } from './dto/create-rdv-request.dto';
import { CreatePartenariatRequestDto } from './dto/create-partnariat-request.dto';
import { CreateMariageRequestDto } from './dto/create-mariage-request.dto';
import { AgentGuard } from '../auth/guards/agent.guard';




@ApiTags('Service Requests')
@Controller('service-requests')
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  // ==================== CRÉATION DES DEMANDES ====================

  @Post('rdv')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une demande de rendez-vous' })
  @ApiResponse({ status: 201, description: 'Demande créée avec succès' })
  createRdvRequest(@Body() createRdvRequestDto: CreateRdvRequestDto, @Request() req) {
    return this.serviceRequestsService.createRdvRequest(createRdvRequestDto, req.user.id);
  }

  @Post('partenariat')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une demande de partenariat' })
  @ApiResponse({ status: 201, description: 'Demande créée avec succès' })
  createPartenariatRequest(@Body() createPartenariatRequestDto: CreatePartenariatRequestDto, @Request() req) {
    return this.serviceRequestsService.createPartenariatRequest(createPartenariatRequestDto, req.user.id);
  }

  @Post('mariage')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une demande de mariage' })
  @ApiResponse({ status: 201, description: 'Demande créée avec succès' })
  createMariageRequest(@Body() createMariageRequestDto: CreateMariageRequestDto, @Request() req) {
    return this.serviceRequestsService.createMariageRequest(createMariageRequestDto, req.user.id);
  }

  // ==================== CONSULTATION DES DEMANDES ====================

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister toutes les demandes (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'etat', required: false })
  @ApiQuery({ name: 'priorite', required: false })
  @ApiQuery({ name: 'agentId', required: false })
  findAll(@Query() filters: any) {
    return this.serviceRequestsService.findAll(filters);
  }

  @Get('my-requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister mes demandes' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'etat', required: false })
  getUserRequests(@Query() filters: any, @Request() req) {
    return this.serviceRequestsService.getUserRequests(req.user.id, filters);
  }

  @Get('reference/:reference')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir une demande par son numéro de référence' })
  findByReference(@Param('reference') reference: string, @Request() req) {
    const userId = req.user.role === 'admin' || req.user.role === 'agent' ? undefined : req.user.id;
    return this.serviceRequestsService.findByReference(reference, userId);
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les statistiques des demandes' })
  @ApiQuery({ name: 'dateDebut', required: false })
  @ApiQuery({ name: 'dateFin', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'agentId', required: false })
  getStatistics(@Query() filters: any) {
    return this.serviceRequestsService.getStatistics(filters);
  }

  @Get('agent-workload/:agentId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir la charge de travail d\'un agent' })
  getAgentWorkload(@Param('agentId', ParseUUIDPipe) agentId: string) {
    return this.serviceRequestsService.getAgentWorkload(agentId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir une demande par ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const userId = req.user.role === 'admin' || req.user.role === 'agent' ? undefined : req.user.id;
    return this.serviceRequestsService.findOne(id, userId);
  }

  // ==================== GESTION DES TRAITEMENTS ====================

  @Post('treatments')
  @UseGuards(JwtAuthGuard, AgentGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un traitement (Agent/Admin)' })
  @ApiResponse({ status: 201, description: 'Traitement créé avec succès' })
  createTreatment(@Body() createTreatmentDto: CreateTreatmentDto, @Request() req) {
    return this.serviceRequestsService.createTreatment(createTreatmentDto, req.user.id);
  }

  @Patch('treatments/:id')
  @UseGuards(JwtAuthGuard, AgentGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un traitement' })
  updateTreatment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTreatmentDto: UpdateTreatmentDto,
    @Request() req
  ) {
    return this.serviceRequestsService.updateTreatment(id, updateTreatmentDto, req.user.id);
  }

  @Post('treatments/:id/finalize')
  @UseGuards(JwtAuthGuard, AgentGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Finaliser un traitement' })
  finalizeTreatment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() finalData: any,
    @Request() req
  ) {
    return this.serviceRequestsService.finalizeTreatment(id, finalData, req.user.id);
  }

  // ==================== GESTION DES DOCUMENTS ====================

  @Post(':id/documents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('files', 10, {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Type de fichier non autorisé'), false);
      }
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Ajouter des documents à une demande' })
  async addDocuments(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { type: string; description?: string }
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const uploadedDocs = [];
    
    for (const file of files) {
      // Ici, vous devriez utiliser votre service d'upload existant
      // pour sauvegarder le fichier et obtenir l'URL
      const documentData = {
        type: body.type,
        nom: file.originalname,
        description: body.description,
        url: `uploads/documents/${Date.now()}-${file.originalname}`,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      };

      const doc = await this.serviceRequestsService.addDocument(id, documentData);
      uploadedDocs.push(doc);
    }

    return { 
      message: 'Documents ajoutés avec succès', 
      documents: uploadedDocs 
    };
  }

  @Post('treatments/:id/documents')
  @UseGuards(JwtAuthGuard, AgentGuard)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Ajouter des documents générés par l\'agent' })
  async addTreatmentDocuments(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { type: string; description?: string }
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const uploadedDocs = [];
    
    for (const file of files) {
      const documentData = {
        type: body.type,
        nom: file.originalname,
        description: body.description,
        url: `uploads/treatment-documents/${Date.now()}-${file.originalname}`,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      };

      const doc = await this.serviceRequestsService.addTreatmentDocument(id, documentData);
      uploadedDocs.push(doc);
    }

    return { 
      message: 'Documents générés ajoutés avec succès', 
      documents: uploadedDocs 
    };
  }
}