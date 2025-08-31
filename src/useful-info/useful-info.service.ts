/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { UsefulInfo } from './entities/useful-info.entity';
import { CreateUsefulInfoDto } from './dto/create-useful-info.dto';
import { UsefulInfo } from '../common/entities/useful-info.entity';


@Injectable()
export class UsefulInfoService {
  constructor(
    @InjectRepository(UsefulInfo)
    private usefulInfoRepository: Repository<UsefulInfo>,
  ) {}

  async create(createUsefulInfoDto: CreateUsefulInfoDto) {
    const info = this.usefulInfoRepository.create(createUsefulInfoDto);
    return this.usefulInfoRepository.save(info);
  }

  async findAll() {
    return this.usefulInfoRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const info = await this.usefulInfoRepository.findOne({
      where: { id },
    });

    if (!info) {
      throw new NotFoundException('Information utile non trouvée');
    }

    return info;
  }

//   async update(id: string, updateUsefulInfoDto: UpdateUsefulInfoDto) {
//     const info = await this.findOne(id);
//     Object.assign(info, updateUsefulInfoDto);
//     return this.usefulInfoRepository.save(info);
//   }

  async remove(id: string) {
    const info = await this.findOne(id);
    return this.usefulInfoRepository.remove(info);
  }

  async getLatest() {
    return this.usefulInfoRepository.findOne({
      order: { createdAt: 'DESC' },
    });
  }
}
