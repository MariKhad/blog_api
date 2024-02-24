import { Test, TestingModule } from '@nestjs/testing';
import { CacheRedisService } from './cache-redis.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

describe('CacheRedisService ', () => {
  let service: CacheRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        CacheRedisService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CacheRedisService>(CacheRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
