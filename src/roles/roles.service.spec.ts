import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { ConfigModule } from '@nestjs/config';
import { RolesController } from './roles.controller';
import { UsersService } from '../users/users.service';
import { FilesService } from '../files/files.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Article } from '../articles/entities/article.entity';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        UsersService,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
      imports: [ConfigModule.forRoot()],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
