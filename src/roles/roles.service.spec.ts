import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

describe('RolesService', () => {
  let service: RolesService;
  const ROLE_REPOSITORY_TOKEN = getRepositoryToken(Role);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<RolesService>(RolesService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
