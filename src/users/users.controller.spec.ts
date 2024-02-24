import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FilesService } from '../files/files.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from './users.module';
import { RolesService } from '../roles/roles.service';
import { ConfigModule } from '@nestjs/config';

describe('UsersController', () => {
  let controller: UsersController;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  const ROLE_REPOSITORY_TOKEN = getRepositoryToken(Role);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        UsersService,
        RolesService,
        FilesService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
