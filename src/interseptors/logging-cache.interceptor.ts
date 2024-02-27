//? Used for development
import {
  Injectable,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class LoggingCacheInterceptor extends CacheInterceptor {
  private readonly logger = new Logger(LoggingCacheInterceptor.name);

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    this.logger.log('CacheInterceptor: Intercepting request...');
    const result = await super.intercept(context, next);
    return result.pipe(
      tap(() => {
        this.logger.log('CacheInterceptor: Intercepting response...');
      }),
    );
  }

  trackBy(context: ExecutionContext): string | undefined {
    this.logger.log('CacheInterceptor: Tracking cache...');
    const key = super.trackBy(context);
    return key;
  }
}
