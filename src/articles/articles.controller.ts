import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Req,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../decorators/public.decorator';
import { User } from '../users/entities/user.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Article } from './entities/article.entity';
import { DEFAULTS } from '../../const';
import { CacheRedisService } from '../cache/cache-redis.service';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly cacheRedisService: CacheRedisService,
  ) {
    this.articlesService.deleteCache();
    this.articlesService.cashAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({
    status: 201,
    type: Article,
    description: 'Create a new article',
  })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile() image: any,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    if (user) {
      const id = user.id;
      return this.articlesService.create(createArticleDto, image, id);
    }
  }

  @Public()
  @Get()
  async findAll() {
    try {
      const cachedResult = await this.articlesService.getAllFromCash();
      if (cachedResult) {
        return cachedResult;
      } else {
        const articles = await this.articlesService.findAll();
        await this.cacheRedisService.setCache('articles', articles);
        return articles;
      }
    } catch (e) {
      throw new NotFoundException({ error: e.message });
    }
  }

  //TODO Find way to cash requests with filters properly
  @Get('sort')
  async findWithFilters(
    @Query()
    queryParams: {
      page?: number;
      limit?: number;
      filters?: Record<string, unknown>;
    },
  ) {
    const { page = 1, limit = DEFAULTS.PAG_LIMIT, ...filters } = queryParams;
    return this.articlesService.findWithFilters(page, limit, filters);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const cachedResult =
        (await this.articlesService.getAllFromCash()) as Record<
          string,
          unknown
        >[];

      if (cachedResult) {
        const cachedArticle = await this.articlesService.getFromCacheById(
          cachedResult,
          +id,
        );

        if (cachedArticle) {
          return cachedArticle;
        }
      }

      return this.articlesService.findById(+id);
    } catch (e) {
      throw new NotFoundException({ error: e.message });
    }
  }

  @Public()
  @Get('/slug/:slug')
  async show(@Param('slug') slug: string) {
    try {
      const cachedResult =
        (await this.articlesService.getAllFromCash()) as Record<
          string,
          unknown
        >[];

      if (cachedResult) {
        const cachedArticle = await this.articlesService.getFromCacheBySlug(
          cachedResult,
          slug,
        );

        if (cachedArticle) {
          return cachedArticle;
        }
      }

      const article = await this.articlesService.findBySlug(slug);
      return article;
    } catch (e) {
      throw new NotFoundException({ error: e.message });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }

  @ApiOperation({ summary: 'Update article, that is found by id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }
}
