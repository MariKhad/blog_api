import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { FilesService } from '../files/files.service';
import { CacheRedisService } from '../cache/cache-redis.service';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  mockCacheManager,
  mockResult,
  randomId,
  wrongId,
} from '../fixtures/commonFixtures';
import { SlugService } from '../slug/slug.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ERRORS } from '../../const';
import {
  getRandomArticleNoTitle,
  mockCreatedArticle,
  mockQueryParams,
} from '../fixtures/articleFixtures';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: ArticlesService;
  const ARTICLE_REPOSITORY_TOKEN = getRepositoryToken(Article);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        ArticlesService,
        FilesService,
        CacheRedisService,
        SlugService,
        {
          provide: ARTICLE_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
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
    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/GET articles/:id, able to find article by id', async () => {
    const articleId = randomId().toString();
    const foundArticle = mockCreatedArticle;
    jest.spyOn(service, 'findById').mockResolvedValue(foundArticle);
    const result = await controller.findOne(articleId);
    expect(result).toEqual(foundArticle);
  });

  it('/GET /articles/:id, able to throw error on wrong article id', async () => {
    jest
      .spyOn(service, 'findById')
      .mockRejectedValue(new Error(ERRORS.ARTICLE_NOT_FOUND));
    await expect(controller.findOne(wrongId)).rejects.toThrow(
      ERRORS.ARTICLE_NOT_FOUND,
    );
  });

  it('/GET articles, able to find all articles', async () => {
    const articles = [
      { ...mockCreatedArticle },
      { ...mockCreatedArticle },
    ] as Article[];

    jest.spyOn(service, 'findAll').mockResolvedValue(articles);
    const result = await controller.findAll();

    expect(result).toEqual(articles);
  });

  it('/GET /articles should return articles with filters and pagination', async () => {
    const queryParams = mockQueryParams;

    const expectedResponse = [
      { ...mockCreatedArticle },
      { ...mockCreatedArticle },
    ] as Article[];

    jest.spyOn(service, 'findWithFilters').mockResolvedValue(expectedResponse);
    const result = await controller.findWithFilters(queryParams);

    expect(result).toEqual(expectedResponse);
    expect(service.findWithFilters).toHaveBeenCalledWith(1, 10, {
      filters: { author: 7, title: 'Sample Article' },
    });
  });

  it('/GET should return article by slug', async () => {
    const slug = 'test-article';
    const article = mockCreatedArticle;
    jest.spyOn(service, 'findBySlug').mockResolvedValue(article);

    const result = await controller.show(slug);

    expect(result).toEqual(article);
  });

  it('/PATCH /articles/:id should successfully update a article', async () => {
    const articleId = wrongId;
    const updateArticleDto = getRandomArticleNoTitle();
    const expectedResult = mockResult as UpdateResult;

    jest.spyOn(service, 'update').mockResolvedValue(expectedResult);
    const result = await controller.update(articleId, updateArticleDto);

    expect(result).toEqual(expectedResult);
  });

  it('/PATCH /articles/:id should throw NotFoundException for invalid article id', async () => {
    const articleId = wrongId;
    const updateArticleDto = getRandomArticleNoTitle();
    jest
      .spyOn(service, 'update')
      .mockRejectedValue(new NotFoundException(ERRORS.ARTICLE_NOT_FOUND));
    await expect(
      controller.update(articleId, updateArticleDto),
    ).rejects.toThrow(ERRORS.ARTICLE_NOT_FOUND);
  });

  it('/DELETE /articles/:id should successfully delete an article', async () => {
    const articleId = randomId().toString();
    const expectedResult = mockResult as DeleteResult;

    jest.spyOn(service, 'remove').mockResolvedValue(expectedResult);
    const result = await controller.remove(articleId);

    expect(result).toEqual(expectedResult);
  });

  it('/DELETE /articles/:id should throw NotFoundException for invalid article id', async () => {
    const articleId = wrongId;
    jest
      .spyOn(service, 'remove')
      .mockRejectedValue(new NotFoundException(ERRORS.ARTICLE_NOT_FOUND));
    await expect(controller.remove(articleId)).rejects.toThrow(
      ERRORS.ARTICLE_NOT_FOUND,
    );
  });
});
