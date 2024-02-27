import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmOptions } from './connection';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';

export const globalGuard = {
  provide: APP_GUARD,
  useClass: JwtGuard,
};

//? Decided not to use
/* const globalInterceptor = {
  provide: APP_INTERCEPTOR,
  useClass: CacheInterceptor,
}; */

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(configService),
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    ArticlesModule,
  ],
  providers: [globalGuard],
})
export class AppModule {}
