import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheRedisService } from './cache-redis.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 43200,
      max: 10,
    }),
  ],
  providers: [CacheRedisService],
})
export class CacheRedisModule {}
