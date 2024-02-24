import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CacheRedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCache<T>(key: string, value: T[]) {
    return await this.cacheManager.set(key, value);
  }

  async getCache<T>(key: string): Promise<T[]> {
    try {
      const items = await this.cacheManager.get(`${key}`);
      return items as T[];
    } catch (e) {
      throw new NotFoundException({ e });
    }
  }

  async getItemFromCache<T extends Record<string, unknown>>(
    cacheResult: T[],
    propKey: string,
    propValue: unknown,
  ): Promise<T | undefined> {
    const item = cacheResult.find((item) => item[propKey] === propValue);
    return item;
  }

  async deleteCache(key: string) {
    await this.cacheManager.del(key);
    console.log(`Cash for ${key} is deleted `);
  }

  async clear() {
    await this.cacheManager.reset();
    console.log('All cash is cleared');
  }
}
