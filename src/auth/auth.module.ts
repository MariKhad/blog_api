import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Role } from '../roles/entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    ConfigService,
    UsersService,
    RolesService,
    FilesService,
  ],
  imports: [
    TypeOrmModule.forFeature([Role, User]),
    ConfigModule.forRoot(),
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    PassportModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
