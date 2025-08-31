import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private readonly uploadsPath: string;
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  constructor(private configService: ConfigService) {
    this.uploadsPath = this.configService.get<string>('UPLOADS_PATH', './uploads');
    this.ensureUploadsDirectory();
  }

  private async ensureUploadsDirectory() {
    try {
      await fs.access(this.uploadsPath);
    } catch {
      await fs.mkdir(this.uploadsPath, { recursive: true });
    }

    // Créer les sous-dossiers
    const subDirs = ['profiles', 'documents'];
    for (const dir of subDirs) {
      const fullPath = path.join(this.uploadsPath, dir);
      try {
        await fs.access(fullPath);
      } catch {
        await fs.mkdir(fullPath, { recursive: true });
      }
    }
  }

//   getMulterOptions(subfolder: 'profiles' | 'documents'): multer.Options {
//     return {
//       storage: multer.diskStorage({
//         destination: (req, file, cb) => {
//           const uploadPath = path.join(this.uploadsPath, subfolder);
//           cb(null, uploadPath);
//         },
//         filename: (req, file, cb) => {
//           const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
//           cb(null, uniqueName);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (this.allowedMimeTypes.includes(file.mimetype)) {
//           cb(null, true);
//         } else {
//           cb(new BadRequestException('Type de fichier non autorisé'), false);
//         }
//       },
//       limits: {
//         fileSize: this.maxFileSize,
//       },
//     };
//   }
getMulterOptions(subfolder: 'profiles' | 'documents'): multer.Options {
  return {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(this.uploadsPath, subfolder);
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (this.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        // On utilise un Error natif pour respecter le type attendu par Multer
        // cb(new Error('Type de fichier non autorisé'), false);
      }
    },
    limits: {
      fileSize: this.maxFileSize,
    },
  };
}

  async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = path.join(this.uploadsPath, filePath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
    }
  }

  getFileUrl(filePath: string): string {
    const baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:3000');
    return `${baseUrl}/uploads/${filePath}`;
  }

  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Type de fichier non autorisé');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('Fichier trop volumineux (max 5MB)');
    }
  }
}