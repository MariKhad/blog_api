import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { FilesService } from '../files/files.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { CacheRedisService } from '../cache/cache-redis.service';
import { ConfigModule } from '@nestjs/config';
import { CacheRedisModule } from '../cache/cache-redis.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { RolesModule } from '../roles/roles.module';
import { ArticlesModule } from './articles.module';
import { DataSource, Repository } from 'typeorm';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let articleRepository: Repository<Article>;
  let roleRepository: Repository<Role>;
  const ARTICLE_REPOSITORY_TOKEN = getRepositoryToken(Article);
  const ROLE_REPOSITORY_TOKEN = getRepositoryToken(Role);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataSource,
        ArticlesService,
        {
          provide: ARTICLE_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
      imports: [
        ConfigModule.forRoot(),
        CacheRedisModule,
        JwtModule,
        RolesModule,
        ArticlesModule,
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    articleRepository = module.get<Repository<Article>>(
      ARTICLE_REPOSITORY_TOKEN,
    );
    roleRepository = module.get<Repository<Role>>(ROLE_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
