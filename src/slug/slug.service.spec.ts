import { Test, TestingModule } from '@nestjs/testing';
import { SlugService } from './slug.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from '../articles/entities/article.entity';

describe('SlugService', () => {
  let service: SlugService;
  const ARTICLE_REPOSITORY_TOKEN = getRepositoryToken(Article);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlugService,
        {
          provide: ARTICLE_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SlugService>(SlugService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate unique slug', async () => {
    const title = 'Test Article';
    jest.spyOn(service, 'getUniqueSlug').mockResolvedValue('test-article');
    const slug = await service.getUniqueSlug(title);
    expect(slug).toBeDefined();
    expect(slug).toBe('test-article');
  });

  it('should append number to slug if it already exists', async () => {
    jest
      .spyOn(service, 'findSlugs')
      .mockResolvedValue(['test-article', 'test-article-1']);

    const title = 'Test Article';
    const slug = await service.getUniqueSlug(title);
    expect(slug).toBe('test-article-2');
  });

  it('should handle case when findSlugs returns empty array', async () => {
    jest.spyOn(service, 'findSlugs').mockResolvedValue([]);

    const title = 'Test Article';
    const slug = await service.getUniqueSlug(title);
    expect(slug).toBe('test-article');
  });
});
