import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
  ) {}

  async create(createPlaceDto: CreatePlaceDto) {
    const place = this.placeRepository.create(createPlaceDto);
    return this.placeRepository.save(place);
  }

  async findAll(page: number = 1, limit: number = 10, type?: string, search?: string) {
    const queryBuilder = this.placeRepository.createQueryBuilder('place');

    if (type) {
      queryBuilder.andWhere('place.type = :type', { type });
    }

    if (search) {
      queryBuilder.andWhere(
        '(place.title LIKE :search OR place.description LIKE :search OR place.address LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [places, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: places,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const place = await this.placeRepository.findOne({
      where: { id },
    });

    if (!place) {
      throw new NotFoundException('Lieu non trouvé');
    }

    return place;
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto) {
    const place = await this.findOne(id);
    Object.assign(place, updatePlaceDto);
    return this.placeRepository.save(place);
  }

  async remove(id: string) {
    const place = await this.findOne(id);
    return this.placeRepository.remove(place);
  }

  async findByType(type: string, page: number = 1, limit: number = 10) {
    return this.findAll(page, limit, type);
  }
}
