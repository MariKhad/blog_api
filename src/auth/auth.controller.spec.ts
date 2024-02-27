import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MulterModule } from '@nestjs/platform-express';
import { getRandomUser, getRandomUserNoName } from '../fixtures/userFixtures';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilesService } from '../files/files.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/entities/role.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  const ROLE_REPOSITORY_TOKEN = getRepositoryToken(Role);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        ConfigService,
        FilesService,
        RolesService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
      imports: [
        ConfigModule.forRoot(),
        MulterModule.register({ dest: './static' }),
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocked functions after each test
  });

  describe('login', () => {
    it('should return auth token', async () => {
      const authDto = getRandomUserNoName() as CreateAuthDto;
      const expectedResult = { token: 'mockedAccessToken' };
      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(authDto);

      expect(result).toEqual(expectedResult);
      expect(authService.login).toHaveBeenCalledWith(authDto);
    });
  });

  describe('registration', () => {
    it('should return user info after registration', async () => {
      const userDto = getRandomUser() as CreateUserDto;
      const image = {};
      const expectedResult = { token: 'mockedAccessToken' };
      jest.spyOn(authService, 'registration').mockResolvedValue(expectedResult);

      const result = await controller.registration(userDto, image);

      expect(result).toEqual(expectedResult);
      expect(authService.registration).toHaveBeenCalledWith(userDto, image);
    });
  });
});
