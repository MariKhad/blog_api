import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DeleteResult,
  UpdateResult,
  MoreThan,
  ILike,
} from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article.entity';
import { FilesService } from '../files/files.service';
import { DEFAULTS, ERRORS } from '../../const';

import { UpdateArticleDto } from './dto/update-article.dto';
import { CacheRedisService } from '../cache/cache-redis.service';
import { SlugService } from '../slug/slug.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private readonly fileService: FilesService,
    private readonly cacheRedisService: CacheRedisService,
    private readonly slugService: SlugService,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    image: any,
    id: number,
  ): Promise<Article | undefined> {
    const filename = async () => {
      if (!image) {
        return DEFAULTS.PLACEHOLDER;
      } else {
        return await this.fileService.createFile(image);
      }
    };

    if (!createArticleDto.slug) {
      const slug = await this.slugService.getUniqueSlug(createArticleDto.title);
      createArticleDto.slug = slug;
    } else {
      createArticleDto.slug = await this.slugService.getUniqueSlug(
        createArticleDto.slug,
      );
    }
    const article = this.articleRepository.create({
      ...createArticleDto,
      image: await filename(),
      author: { id },
    });
    return this.articleRepository.save(article);
  }

  async findAll(): Promise<Article[]> {
    return this.articleRepository.find({
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findWithFilters(
    page: number,
    limit: number,
    filters: any,
  ): Promise<Article[]> {
    const checkedFilters = this.checkFilters(filters);
    return this.articleRepository.find({
      where: checkedFilters,
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async findById(id: number): Promise<Article | undefined> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!article) {
      throw new NotFoundException(ERRORS.ARTICLE_NOT_FOUND);
    }
    return article;
  }

  async findBySlug(slug: string): Promise<Article | null> {
    const article = await this.articleRepository.findOne({
      where: {
        slug,
      },
    });
    if (!article) {
      throw new NotFoundException();
    }
    return article;
  }

  private checkFilters(filters: any) {
    if (filters.title) {
      filters.title = ILike(`%${filters.title}%`);
    }
    if (filters.author) {
      filters.author = { id: filters.author };
    }
    if (filters.createdIn) {
      const date = new Date();
      date.setDate(date.getDate() - filters.createdIn);
      filters.createdAt = MoreThan(date);
      delete filters.createdIn;
    }
    return filters;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<UpdateResult> {
    if (updateArticleDto.slug) {
      updateArticleDto.slug = await this.slugService.getUniqueSlug(
        updateArticleDto.slug,
      );
    }
    const updateResult = await this.articleRepository.update(
      id,
      updateArticleDto,
    );
    await this.deleteCache();
    await this.cashAll();
    return updateResult;
  }

  async remove(id: number): Promise<DeleteResult> {
    const deleteResult = await this.articleRepository.delete(id);
    await this.deleteCache();
    await this.cashAll();
    return deleteResult;
  }

  async cashAll(): Promise<void> {
    const articles = await this.articleRepository.find({
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });
    this.cacheRedisService.setCache('articles', articles);
    console.log('All articles were set to cash');
  }

  async getAllFromCash(): Promise<Record<string, unknown>[]> {
    try {
      const articles = (await this.cacheRedisService.getCache(
        'articles',
      )) as Record<string, unknown>[];
      return articles;
    } catch (e) {
      throw new NotFoundException({ error: e.message });
    }
  }

  async deleteCache(): Promise<void> {
    await this.cacheRedisService.clear();
  }

  async getFromCacheById<T extends Record<string, unknown>>(
    cacheResult: T[],
    id: number,
  ) {
    return this.cacheRedisService.getItemFromCache(cacheResult, 'id', +id);
  }

  async getFromCacheBySlug<T extends Record<string, unknown>>(
    cacheResult: T[],
    slug: string,
  ) {
    return this.cacheRedisService.getItemFromCache(cacheResult, 'slug', slug);
  }
}
