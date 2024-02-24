import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from './users.module';
import { FilesService } from '../files/files.service';
import { RolesService } from '../roles/roles.service';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;
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
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
