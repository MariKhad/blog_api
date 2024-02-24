import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { FilesService } from '../files/files.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { CacheRedisService } from '../cache/cache-redis.service';
import { ConfigModule } from '@nestjs/config';
import { CacheRedisModule } from '../cache/cache-redis.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

describe('ArticlesController', () => {
  let controller: ArticlesController;
  const ARTICLE_REPOSITORY_TOKEN = getRepositoryToken(Article);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        ArticlesService,
        FilesService,
        CacheRedisService,
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
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
      imports: [ConfigModule.forRoot()],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
