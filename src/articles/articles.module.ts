import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';
import { FilesService } from '../files/files.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { RolesModule } from '../roles/roles.module';
import { Role } from '../roles/entities/role.entity';
import { CacheRedisService } from '../cache/cache-redis.service';
import { CacheRedisModule } from '../cache/cache-redis.module';
import { ConfigModule } from '@nestjs/config';
import { SlugService } from '../slug/slug.service';

@Module({
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    FilesService,
    JwtService,
    UsersService,
    RolesService,
    CacheRedisService,
    SlugService,
  ],
  imports: [
    ConfigModule.forRoot(),
    CacheRedisModule,
    TypeOrmModule.forFeature([Article, User, Role]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    RolesModule,
  ],
})
export class ArticlesModule {}
