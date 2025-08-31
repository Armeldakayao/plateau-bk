import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { CreateCitizenDto } from './dto/create-citizens.dto';

@Injectable()
export class CitizensService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCitizenDto: CreateCitizenDto) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email: createCitizenDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un citoyen avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createCitizenDto.password, 12);

    // Créer l'utilisateur (citoyen créé par admin = automatiquement vérifié)
    const citizen = this.userRepository.create({
      firstName: createCitizenDto.firstName,
      lastName: createCitizenDto.lastName,
      birthDate: new Date(createCitizenDto.birthDate),
      birthPlace: createCitizenDto.residence, // Utiliser residence comme birthPlace
      nationality: 'Non spécifiée', // Valeur par défaut
      city: createCitizenDto.residence,
      email: createCitizenDto.email,
      phone: createCitizenDto.phone,
      password: hashedPassword,
      idType: createCitizenDto.idType,
      idNumber: `ID-${Date.now()}`, // Générer un numéro temporaire
      acceptTerms: true,
      acceptDataPolicy: true,
      isVerified: true, // Auto-vérifié car créé par admin
      role: 'user',
    });

    const savedCitizen = await this.userRepository.save(citizen);

    return {
      message: 'Citoyen créé avec succès',
      citizen: {
        id: savedCitizen.id,
        firstName: savedCitizen.firstName,
        lastName: savedCitizen.lastName,
        email: savedCitizen.email,
        phone: savedCitizen.phone,
      },
    };
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [citizens, total] = await this.userRepository.findAndCount({
      where: { role: 'user' },
      // eslint-disable-next-line prettier/prettier
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'city', 'isVerified', 'createdAt'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: citizens,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
