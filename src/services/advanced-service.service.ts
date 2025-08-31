/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdvancedService } from './entities/service-advanced.entity';
import { CreateAdvancedServiceDto } from './dto/create-advanced-service.dto';
import { UpdateAdvancedServiceDto } from './dto/update-advanced-service.dto';


@Injectable()
export class AdvancedServicesService {
  constructor(
    @InjectRepository(AdvancedService)
    private advancedServiceRepository: Repository<AdvancedService>,
  ) {}

  async create(createAdvancedServiceDto: CreateAdvancedServiceDto) {
    // eslint-disable-next-line prettier/prettier
    const service = this.advancedServiceRepository.create(createAdvancedServiceDto);
    return this.advancedServiceRepository.save(service);
  }

  async findAll(page: number = 1, limit: number = 10, category?: string) {
    const queryBuilder = this.advancedServiceRepository.createQueryBuilder('service');

    if (category) {
      queryBuilder.where('service.category = :category', { category });
    }

    const [services, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: services,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const service = await this.advancedServiceRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service avancé non trouvé');
    }

    return service;
  }

  async update(id: string, updateAdvancedServiceDto: UpdateAdvancedServiceDto) {
    const service = await this.findOne(id);
    Object.assign(service, updateAdvancedServiceDto);
    return this.advancedServiceRepository.save(service);
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    return this.advancedServiceRepository.remove(service);
  }

  async getFormStructure(id: string) {
    const service = await this.findOne(id);
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      conditions: service.conditions,
      acceptedDocuments: service.acceptedDocuments,
      formFields: service.formFields,
      confirmationMessage: service.confirmationMessage,
    };
  }
}
