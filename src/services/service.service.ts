// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Service } from './entities/service.entity';
// import { CreateServiceDto } from './dto/create-service.dto';
// import { UpdateServiceDto } from './dto/update-service.dto';


// @Injectable()
// export class ServicesService {
//   constructor(
//     @InjectRepository(Service)
//     private serviceRepository: Repository<Service>,
//   ) {}

//   async create(createServiceDto: CreateServiceDto) {
//     const service = this.serviceRepository.create(createServiceDto);
//     return this.serviceRepository.save(service);
//   }

//   async findAll(page: number = 1, limit: number = 10, category?: string) {
//     const queryBuilder = this.serviceRepository.createQueryBuilder('service');

//     if (category) {
//       queryBuilder.where('service.category = :category', { category });
//     }

//     const [services, total] = await queryBuilder
//       .skip((page - 1) * limit)
//       .take(limit)
//       .getManyAndCount();

//     return {
//       data: services,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }

//   async findOne(id: string) {
//     const service = await this.serviceRepository.findOne({
//       where: { id },
//     });

//     if (!service) {
//       throw new NotFoundException('Service non trouvé');
//     }

//     return service;
//   }

//   async update(id: string, updateServiceDto: UpdateServiceDto) {
//     const service = await this.findOne(id);
//     Object.assign(service, updateServiceDto);
//     return this.serviceRepository.save(service);
//   }

//   async remove(id: string) {
//     const service = await this.findOne(id);
//     return this.serviceRepository.remove(service);
//   }

//   async findByCategory(category: string, page: number = 1, limit: number = 10) {
//     return this.findAll(page, limit, category);
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const service = this.serviceRepository.create(createServiceDto);
    return this.serviceRepository.save(service);
  }

  async findAll(page: number = 1, limit: number = 10, category?: string) {
    const queryBuilder = this.serviceRepository.createQueryBuilder('service');
    
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
    const service = await this.serviceRepository.findOne({
      where: { id },
    });
    
    if (!service) {
      throw new NotFoundException('Service non trouvé');
    }
    
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.findOne(id);
    Object.assign(service, updateServiceDto);
    return this.serviceRepository.save(service);
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    return this.serviceRepository.remove(service);
  }

  async findByCategory(category: string, page: number = 1, limit: number = 10) {
    return this.findAll(page, limit, category);
  }
}
