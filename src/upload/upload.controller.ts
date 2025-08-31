// import {
//   Controller,
//   Post,
//   UseInterceptors,
//   UploadedFile,
//   UploadedFiles,
//   UseGuards,
//   Query,
// } from '@nestjs/common';
// import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
// import { UploadService } from './upload.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// @ApiTags('Upload')
// @Controller('upload')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
// export class UploadController {
//   constructor(private readonly uploadService: UploadService) {}

//   @Post('single')
//   @UseInterceptors(FileInterceptor('file'))
//   @ApiConsumes('multipart/form-data')
//   @ApiOperation({ summary: "Upload d'un seul fichier" })
//   @ApiQuery({ name: 'folder', required: false })
//   async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
//     const filePath = await this.uploadService.uploadFile(file, folder);
//     return {
//       message: 'Fichier uploadé avec succès',
//       filePath,
//       originalName: file.originalname,
//       size: file.size,
//     };
//   }

//   @Post('multiple')
//   @UseInterceptors(FilesInterceptor('files', 10))
//   @ApiConsumes('multipart/form-data')
//   @ApiOperation({ summary: 'Upload de plusieurs fichiers' })
//   @ApiQuery({ name: 'folder', required: false })
//   async uploadFiles(
//     @UploadedFiles() files: Express.Multer.File[],
//     @Query('folder') folder?: string,
//   ) {
//     const filePaths = await this.uploadService.uploadMultipleFiles(files, folder);
//     return {
//       message: 'Fichiers uploadés avec succès',
//       filePaths,
//       count: files.length,
//     };
//   }
// }
import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, UseGuards, Query, Body } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload d\'un seul fichier' })
  @ApiQuery({ name: 'folder', required: false, description: 'Dossier de destination (général par défaut)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Fichier à uploader (images: jpeg, png, gif, webp | documents: pdf, doc, docx)',
        },
      },
      required: ['file'],
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    const filePath = await this.uploadService.uploadFile(file, folder);
    return {
      success: true,
      message: 'Fichier uploadé avec succès',
      data: {
        filePath,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      },
    };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload de plusieurs fichiers (max 10)' })
  @ApiQuery({ name: 'folder', required: false, description: 'Dossier de destination (général par défaut)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Fichiers à uploader (max 10 fichiers)',
        },
      },
      required: ['files'],
    },
  })
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    const filePaths = await this.uploadService.uploadMultipleFiles(files, folder);
    return {
      success: true,
      message: 'Fichiers uploadés avec succès',
      data: {
        filePaths,
        count: files.length,
        files: files.map((file, index) => ({
          originalName: file.originalname,
          filePath: filePaths[index],
          size: file.size,
          mimeType: file.mimetype,
        })),
      },
    };
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload d\'avatar utilisateur' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Image d\'avatar (jpeg, png, gif, webp seulement)',
        },
      },
      required: ['avatar'],
    },
  })
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    // Vérifier que c'est bien une image
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!imageTypes.includes(file.mimetype)) {
      throw new Error('Seules les images sont autorisées pour l\'avatar');
    }

    const filePath = await this.uploadService.uploadFile(file, 'avatars');
    return {
      success: true,
      message: 'Avatar uploadé avec succès',
      data: {
        avatarPath: filePath,
        originalName: file.originalname,
        size: file.size,
      },
    };
  }

  @Post('documents')
  @UseInterceptors(FilesInterceptor('documents', 5))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload de documents officiels (max 5)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        documents: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Documents officiels (pdf, doc, docx)',
        },
      },
      required: ['documents'],
    },
  })
  async uploadDocuments(@UploadedFiles() files: Express.Multer.File[]) {
    // Vérifier que ce sont des documents
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    for (const file of files) {
      if (!documentTypes.includes(file.mimetype)) {
        throw new Error('Seuls les documents PDF, DOC et DOCX sont autorisés');
      }
    }

    const filePaths = await this.uploadService.uploadMultipleFiles(files, 'documents');
    return {
      success: true,
      message: 'Documents uploadés avec succès',
      data: {
        documentPaths: filePaths,
        count: files.length,
        documents: files.map((file, index) => ({
          originalName: file.originalname,
          filePath: filePaths[index],
          size: file.size,
          type: file.mimetype,
        })),
      },
    };
  }
}