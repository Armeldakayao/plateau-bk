// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable prettier/prettier */
// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Query,
//   Request,
//   UseGuards
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

// import { AdminGuard } from '../auth/guards/admin.guard';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { UsersService } from './user.service';

// @ApiTags('Users')
// @Controller('users')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Get()
//   @UseGuards(AdminGuard)
//   @ApiOperation({ summary: 'Lister tous les utilisateurs (Admin)' })
//   @ApiQuery({ name: 'page', required: false })
//   @ApiQuery({ name: 'limit', required: false })
//   findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
//     return this.usersService.findAll(+page || 1, +limit || 10);
//   }

//   @Get('profile')
//   @ApiOperation({ summary: 'Obtenir son profil' })
//   getProfile(@Request() req) {
//     return this.usersService.getProfile(req.user.id);
//   }

//   @Patch('profile')
//   @ApiOperation({ summary: 'Mettre à jour son profil' })
//   updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
//     return this.usersService.updateProfile(req.user.id, updateUserDto);
//   }

//   @Get(':id')
//   @UseGuards(AdminGuard)
//   @ApiOperation({ summary: 'Obtenir un utilisateur par ID (Admin)' })
//   findOne(@Param('id') id: string) {
//     return this.usersService.findOne(id);
//   }

//   @Patch(':id')
//   @UseGuards(AdminGuard)
//   @ApiOperation({ summary: 'Mettre à jour un utilisateur (Admin)' })
//   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
//     return this.usersService.update(id, updateUserDto);
//   }

//   @Delete(':id')
//   @UseGuards(AdminGuard)
//   @ApiOperation({ summary: 'Supprimer un utilisateur (Admin)' })
//   remove(@Param('id') id: string) {
//     return this.usersService.remove(id);
//   }
// }
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  ApiBearerAuth, 
  ApiOperation, 
  ApiQuery, 
  ApiTags, 
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadDocumentDto, UpdateDocumentDto } from './dto/upload-document.dto';
import { UsersService } from './user.service';
import { UserDocumentsService } from './user-document.service';
import { FileUploadService } from './upload-document.service';


@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userDocumentsService: UserDocumentsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Lister tous les utilisateurs (Admin)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.usersService.findAll(+page || 1, +limit || 10);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Obtenir son profil' })
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Mettre à jour son profil' })
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }

  // Routes pour la photo de profil
  @Post('profile/photo')
  @UseInterceptors(FileInterceptor('photo', {
    storage: undefined, // Sera défini par le service
  }))
  @ApiOperation({ summary: 'Télécharger une photo de profil' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Photo de profil',
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadProfilePhoto(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const user = await this.userDocumentsService.updateProfilePhoto(req.user.id, file);
    return {
      message: 'Photo de profil mise à jour avec succès',
      profilePhoto: user.profilePhoto ? this.fileUploadService.getFileUrl(user.profilePhoto) : null,
    };
  }

  // Routes pour les documents
  @Post('documents')
  @UseInterceptors(FileInterceptor('file', {
    storage: undefined, // Sera défini par le service
  }))
  @ApiOperation({ summary: 'Télécharger un document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Document à télécharger',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        documentType: {
          type: 'string',
          enum: ['identity_card', 'passport', 'driving_license', 'birth_certificate', 'diploma', 'contract', 'other'],
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  async uploadDocument(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDocumentDto: UploadDocumentDto,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const document = await this.userDocumentsService.uploadDocument(
      req.user.id,
      file,
      uploadDocumentDto,
    );

    return {
      message: 'Document téléchargé avec succès',
      document: {
        ...document,
        fileUrl: this.fileUploadService.getFileUrl(document.filePath),
      },
    };
  }

  @Get('documents')
  @ApiOperation({ summary: 'Récupérer tous ses documents' })
  async getUserDocuments(@Request() req) {
    return this.userDocumentsService.getUserDocuments(req.user.id);
  }

  @Get('files')
  @ApiOperation({ summary: 'Récupérer tous les fichiers (photo + documents)' })
  async getAllUserFiles(@Request() req, @Query('includeInactive') includeInactive?: string) {
    const includeInactiveFiles = includeInactive === 'true';
    return this.userDocumentsService.getAllUserDocuments(req.user.id, includeInactiveFiles);
  }

  @Get('documents/:documentId')
  @ApiOperation({ summary: 'Récupérer un document spécifique' })
  async getDocument(@Request() req, @Param('documentId') documentId: string) {
    const document = await this.userDocumentsService.getDocumentById(documentId, req.user.id);
    return {
      ...document,
      fileUrl: this.fileUploadService.getFileUrl(document.filePath),
    };
  }

  @Patch('documents/:documentId')
  @ApiOperation({ summary: 'Mettre à jour les informations d\'un document' })
  async updateDocument(
    @Request() req,
    @Param('documentId') documentId: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    const document = await this.userDocumentsService.updateDocument(
      documentId,
      req.user.id,
      updateDocumentDto,
    );

    return {
      message: 'Document mis à jour avec succès',
      document: {
        ...document,
        fileUrl: this.fileUploadService.getFileUrl(document.filePath),
      },
    };
  }

  @Delete('documents/:documentId')
  @ApiOperation({ summary: 'Supprimer un document' })
  async deleteDocument(@Request() req, @Param('documentId') documentId: string) {
    await this.userDocumentsService.deleteDocument(documentId, req.user.id);
    return { message: 'Document supprimé avec succès' };
  }

  // Routes admin pour les autres utilisateurs
  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Obtenir un utilisateur par ID (Admin)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/files')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Récupérer tous les fichiers d\'un utilisateur (Admin)' })
  async getUserFiles(@Param('id') userId: string, @Query('includeInactive') includeInactive?: string) {
    const includeInactiveFiles = includeInactive === 'true';
    return this.userDocumentsService.getAllUserDocuments(userId, includeInactiveFiles);
  }

  @Post(':id/documents')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Télécharger un document pour un utilisateur (Admin)' })
  @ApiConsumes('multipart/form-data')
  async uploadDocumentForUser(
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDocumentDto: UploadDocumentDto,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const document = await this.userDocumentsService.uploadDocument(
      userId,
      file,
      uploadDocumentDto,
    );

    return {
      message: 'Document téléchargé avec succès',
      document: {
        ...document,
        fileUrl: this.fileUploadService.getFileUrl(document.filePath),
      },
    };
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Mettre à jour un utilisateur (Admin)' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Supprimer un utilisateur (Admin)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}