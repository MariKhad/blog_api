import { Test, TestingModule } from '@nestjs/testing';
import { CacheRedisService } from './cache-redis.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';

const mockCacheManager = {
  get: jest.fn().mockRejectedValue(null),
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

  describe('setCache', () => {
    it('should set cache successfully', async () => {
      const key = 'testKey';
      const value = [1, 2, 3];
      await expect(service.setCache(key, value)).resolves.not.toThrow();
    });
  });

  describe('getCache', () => {
    it('should return cached items if found', async () => {
      const key = 'testKey';
      const cachedValue = ['item1', 'item2', 'item3'];
      mockCacheManager.get.mockResolvedValue(cachedValue);
      const result = await service.getCache<string[]>(key);
      expect(result).toEqual(cachedValue);
    });
  });

  describe('getItemFromCache', () => {
    it('should return item from cache if found', async () => {
      const cacheResult = [
        { id: 1, name: 'item1' },
        { id: 2, name: 'item2' },
      ];
      const propKey = 'id';
      const propValue = 1;

      const result = await service.getItemFromCache(
        cacheResult,
        propKey,
        propValue,
      );

      expect(result).toEqual({ id: 1, name: 'item1' });
    });

    it('should return undefined if item not found in cache', async () => {
      const cacheResult = [
        { id: 1, name: 'item1' },
        { id: 2, name: 'item2' },
      ];
      const propKey = 'id';
      const propValue = 3;

      const result = await service.getItemFromCache(
        cacheResult,
        propKey,
        propValue,
      );

      expect(result).toBeUndefined();
    });
  });

  describe('deleteCache', () => {
    it('should delete cache successfully', async () => {
      const key = 'testKey';
      await service.setCache(key, [1, 2, 3]);

      await expect(service.deleteCache(key)).resolves.not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all cache', async () => {
      await expect(service.clear()).resolves.not.toThrow();
    });
  });
});
