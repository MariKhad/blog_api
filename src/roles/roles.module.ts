import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Article } from '../articles/entities/article.entity';
import { UsersService } from '../users/users.service';
import { FilesService } from '../files/files.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [RolesController],
  providers: [RolesService, UsersService, FilesService],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Role, User, Article]),
  ],
  exports: [RolesService],
})
export class RolesModule {}
