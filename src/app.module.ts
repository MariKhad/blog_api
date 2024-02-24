import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmOptions } from './connection';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

const globalGuard = {
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
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        synchronize:
          process.env.NODE_ENV !== 'production' &&
          process.env.NODE_ENV !== 'test',
        logging:
          process.env.NODE_ENV !== 'production' &&
          process.env.NODE_ENV !== 'test',
      }),
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    FilesModule,
    ArticlesModule,
  ],
  providers: [globalGuard, AppService],
})
export class AppModule {}
