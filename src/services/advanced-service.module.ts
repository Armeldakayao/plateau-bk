import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdvancedService } from './entities/service-advanced.entity';
import { AdvancedServicesService } from './advanced-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdvancedService])],
  providers: [AdvancedServicesService],
  exports: [AdvancedServicesService], // pour l'utiliser dans d'autres modules
})
export class AdvancedServicesModule {}
