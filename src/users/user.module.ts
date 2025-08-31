// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import { User } from './entities/user.entity';
// import { UsersController } from './user.controller';
// import { UsersService } from './user.service';

// @Module({
//   imports: [TypeOrmModule.forFeature([User])],
//   controllers: [UsersController],
//   providers: [UsersService],
//   exports: [UsersService],
// })
// export class UsersModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersService } from './user.service';


import { User } from './entities/user.entity';
import { UserDocument } from './entities/user-document.entity';
import { FileUploadService } from './upload-document.service';
import { UserDocumentsService } from './user-document.service';
import { UsersController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserDocument]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const fileUploadService = new FileUploadService(configService);
        return {
          ...fileUploadService.getMulterOptions('documents'),
          dest: configService.get<string>('UPLOADS_PATH', './uploads'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserDocumentsService,
    FileUploadService,
  ],
  exports: [UsersService, UserDocumentsService],
})
export class UsersModule {}