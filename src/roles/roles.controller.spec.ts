import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { FilesService } from '../files/files.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Article } from '../articles/entities/article.entity';

describe('RolesController', () => {
  let controller: RolesController;
  const ROLE_REPOSITORY_TOKEN = getRepositoryToken(Role);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        RolesService,
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
      imports: [ConfigModule.forRoot()],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
