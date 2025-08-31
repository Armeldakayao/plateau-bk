import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File, folder: string = 'general'): Promise<string> {
    // Vérifier le type de fichier
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Type de fichier non autorisé');
    }

    // Vérifier la taille
    const maxSize = this.configService.get('MAX_FILE_SIZE') || 5242880; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('Fichier trop volumineux');
    }

    // Générer un nom unique
    const fileExtension = extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;

    // Créer le dossier de destination
    const uploadPath = this.configService.get('UPLOAD_PATH') || './uploads';
    const destinationFolder = path.join(uploadPath, folder);

    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    // Sauvegarder le fichier
    const filePath = path.join(destinationFolder, fileName);
    fs.writeFileSync(filePath, file.buffer);

    // Retourner l'URL relative
    return `uploads/${folder}/${fileName}`;
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'general',
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}
