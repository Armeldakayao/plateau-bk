import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDocument } from './entities/user-document.entity';
import { User } from './entities/user.entity';

import { UploadDocumentDto, UpdateDocumentDto } from './dto/upload-document.dto';
import { FileUploadService } from './upload-document.service';

@Injectable()
export class UserDocumentsService {
  constructor(
    @InjectRepository(UserDocument)
    private userDocumentRepository: Repository<UserDocument>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private fileUploadService: FileUploadService,
  ) {}

  async uploadDocument(
    userId: string,
    file: Express.Multer.File,
    uploadDocumentDto: UploadDocumentDto,
  ): Promise<UserDocument> {
    // Vérifier que l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    this.fileUploadService.validateFile(file);

    // Créer l'enregistrement du document
    const document = this.userDocumentRepository.create({
      fileName: file.filename,
      originalName: file.originalname,
      filePath: `${file.filename}`,
      fileSize: file.size,
      mimeType: file.mimetype,
      documentType: uploadDocumentDto.documentType,
      description: uploadDocumentDto.description,
      userId,
    });

    return this.userDocumentRepository.save(document);
  }

  async updateProfilePhoto(userId: string, file: Express.Multer.File): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    this.fileUploadService.validateFile(file);

    // Supprimer l'ancienne photo si elle existe
    if (user.profilePhoto) {
      await this.fileUploadService.deleteFile(user.profilePhoto);
    }

    // Mettre à jour le chemin de la photo
    user.profilePhoto = `${file.filename}`;
    return this.userRepository.save(user);
  }

  async getUserDocuments(userId: string): Promise<UserDocument[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.userDocumentRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getDocumentById(documentId: string, userId: string): Promise<UserDocument> {
    const document = await this.userDocumentRepository.findOne({
      where: { id: documentId, userId, isActive: true },
    });

    if (!document) {
      throw new NotFoundException('Document non trouvé');
    }

    return document;
  }

  async updateDocument(
    documentId: string,
    userId: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<UserDocument> {
    const document = await this.getDocumentById(documentId, userId);

    Object.assign(document, updateDocumentDto);
    return this.userDocumentRepository.save(document);
  }

  async deleteDocument(documentId: string, userId: string): Promise<void> {
    const document = await this.getDocumentById(documentId, userId);

    // Supprimer le fichier physique
    await this.fileUploadService.deleteFile(document.filePath);

    // Marquer comme inactif au lieu de supprimer définitivement
    document.isActive = false;
    await this.userDocumentRepository.save(document);
  }

  async getAllUserDocuments(userId: string, includeInactive = false): Promise<{
    profilePhoto: string | null;
    documents: UserDocument[];
  }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['documents'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const documentsQuery = this.userDocumentRepository.createQueryBuilder('doc')
      .where('doc.userId = :userId', { userId });

    if (!includeInactive) {
      documentsQuery.andWhere('doc.isActive = :isActive', { isActive: true });
    }

    const documents = await documentsQuery
      .orderBy('doc.createdAt', 'DESC')
      .getMany();

    return {
      profilePhoto: user.profilePhoto ? this.fileUploadService.getFileUrl(user.profilePhoto) : null,
      documents: documents.map(doc => ({
        ...doc,
        fileUrl: this.fileUploadService.getFileUrl(doc.filePath),
      })),
    };
  }
}