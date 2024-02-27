import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { FilesService } from '../files/files.service';
import { CacheRedisService } from '../cache/cache-redis.service';
import { ConfigModule } from '@nestjs/config';
import { Article } from './entities/article.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SlugService } from '../slug/slug.service';
import {
  getRandomArticle,
  getRandomArticleNoTitle,
  mockCreatedArticle,
} from '../fixtures/articleFixtures';
import { NotFoundException } from '@nestjs/common';
import { randomId } from '../fixtures/commonFixtures';
import { DeleteResult, FindOperator, UpdateResult } from 'typeorm';
import { mockResult } from '../fixtures/commonFixtures';
import { UpdateArticleDto } from './dto/update-article.dto';

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

const mockArticleRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
  select: jest.fn(),
};

describe('ArticlesService', () => {
  let service: ArticlesService;
  let slugService: SlugService;
  const ARTICLE_REPOSITORY_TOKEN = getRepositoryToken(Article);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        FilesService,
        CacheRedisService,
        SlugService,
        {
          provide: ARTICLE_REPOSITORY_TOKEN,
          useValue: mockArticleRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: FilesService,
          useValue: {
            createFile: jest.fn().mockResolvedValue('filename.jpg'),
          },
        },
      ],
      imports: [ConfigModule.forRoot()],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    slugService = module.get<SlugService>(SlugService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all articles', async () => {
      const articles: Article[] = [
        { ...mockCreatedArticle },
        { ...mockCreatedArticle },
      ];
      jest.spyOn(mockArticleRepository, 'find').mockResolvedValue(articles);
      const result = await service.findAll();

      expect(result).toEqual(articles);
    });
  });

  describe('create', () => {
    it('should create an article', async () => {
      const createArticleDto = getRandomArticle();
      const article = mockCreatedArticle;
      const uniqSlug = 'test-article';
      jest.spyOn(slugService, 'getUniqueSlug').mockResolvedValue(uniqSlug);
      jest.spyOn(mockArticleRepository, 'create').mockReturnValue(article);
      jest.spyOn(mockArticleRepository, 'save').mockResolvedValue(article);

      const result = await service.create(createArticleDto, {}, 1);

      expect(result).toEqual(article);
    });
  });

  describe('findById', () => {
    it('should return article if found', async () => {
      const article = mockCreatedArticle;
      jest.spyOn(mockArticleRepository, 'findOne').mockResolvedValue(article);

      const result = await service.findById(1);
      expect(result).toEqual(article);
    });

    it('should throw NotFoundException if article not found', async () => {
      const id = randomId();
      jest.spyOn(mockArticleRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findById(id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('findWithFilters', () => {
    it('should find articles with given filters', async () => {
      const filters = { title: 'test', author: 1 };
      const page = 1;
      const limit = 10;
      const checkedFilters = {
        title: expect.any(FindOperator),
        author: { id: 1 },
      };
      const findSpy = jest
        .spyOn(mockArticleRepository, 'find')
        .mockResolvedValue([]);

      await service.findWithFilters(page, limit, filters);

      expect(findSpy).toHaveBeenCalledWith({
        where: checkedFilters,
        relations: ['author'],
        order: {
          createdAt: 'DESC',
        },
        take: limit,
        skip: 0,
      });
    });
  });

  describe('findBySlug', () => {
    it('should return an article if found by slug', async () => {
      const slug = 'test-slug';
      const article = mockCreatedArticle;
      jest.spyOn(mockArticleRepository, 'findOne').mockResolvedValue(article);
      const result = await service.findBySlug(slug);
      expect(result).toEqual(article);
    });

    it('should throw NotFoundException if article not found by slug', async () => {
      const slug = 'non-existent-slug';
      jest.spyOn(mockArticleRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findBySlug(slug)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an article and clear cache', async () => {
      const id = randomId();
      const updateArticleDto = getRandomArticleNoTitle() as UpdateArticleDto;
      const updateResultMock = mockResult as UpdateResult; // Мок результат удаления
      jest
        .spyOn(mockArticleRepository, 'update')
        .mockResolvedValue(updateResultMock);
      const deleteCacheSpy = jest
        .spyOn(service, 'deleteCache')
        .mockResolvedValue(undefined);
      const cashAllSpy = jest
        .spyOn(service, 'cashAll')
        .mockResolvedValue(undefined);
      const result = await service.update(id, updateArticleDto);
      expect(result).toEqual(updateResultMock);
      expect(deleteCacheSpy).toHaveBeenCalledTimes(1);
      expect(deleteCacheSpy).toHaveBeenCalledWith();
      expect(cashAllSpy).toHaveBeenCalledTimes(1);
      expect(cashAllSpy).toHaveBeenCalledWith();
    });
  });

  describe('remove', () => {
    it('should remove an article and clear cache', async () => {
      const id = randomId();
      const deleteResultMock = mockResult as DeleteResult; // Мок результат удаления
      jest
        .spyOn(mockArticleRepository, 'delete')
        .mockResolvedValue(deleteResultMock);
      const deleteCacheSpy = jest
        .spyOn(service, 'deleteCache')
        .mockResolvedValue(undefined);
      const cashAllSpy = jest
        .spyOn(service, 'cashAll')
        .mockResolvedValue(undefined);
      const result = await service.remove(id);
      expect(result).toEqual(deleteResultMock);
      expect(deleteCacheSpy).toHaveBeenCalledTimes(1);
      expect(deleteCacheSpy).toHaveBeenCalledWith();
      expect(cashAllSpy).toHaveBeenCalledTimes(1);
      expect(cashAllSpy).toHaveBeenCalledWith();
    });
  });
});
