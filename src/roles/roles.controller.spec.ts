import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { mockCreateRoleDto, mockCreatedRole } from '../fixtures/roleFixtures';
import { mockResult, randomId } from '../fixtures/commonFixtures';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;
  const ROLE_REPOSITORY_TOKEN = getRepositoryToken(Role);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        RolesService,
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
      imports: [ConfigModule.forRoot()],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST /roles should create a new role', async () => {
    const createRoleDto = mockCreateRoleDto;
    const createdRole = mockCreatedRole;

    jest.spyOn(service, 'createRole').mockResolvedValue(createdRole);
    const result = await controller.create(createRoleDto);

    expect(result).toEqual(createdRole);
    expect(service.createRole).toHaveBeenCalledWith(createRoleDto);
  });

  it('GET /roles/:value should return a role by value', async () => {
    const roleValue = 'admin';
    const role = mockCreatedRole;

    jest.spyOn(service, 'getRoleByValue').mockResolvedValue(role);
    const result = await controller.findOne(roleValue);

    expect(result).toEqual(role);
    expect(service.getRoleByValue).toHaveBeenCalledWith(
      roleValue.toLowerCase(),
    );
  });

  it('PATCH /roles/:id should update a role by id', async () => {
    const roleId = randomId();
    const updateRoleDto = mockCreateRoleDto as UpdateRoleDto;
    const expectedResult = mockResult as UpdateResult;

    jest.spyOn(service, 'update').mockResolvedValue(expectedResult);
    const result = await controller.update(roleId, updateRoleDto);

    expect(result).toEqual(expectedResult);
    expect(service.update).toHaveBeenCalledWith(roleId, updateRoleDto);
  });

  it('DELETE /roles/:id should delete a role by id', async () => {
    const roleId = randomId();
    const expectedResult = mockResult as DeleteResult;

    jest.spyOn(service, 'remove').mockResolvedValue(expectedResult);
    const result = await controller.remove(roleId);

    expect(result).toEqual(expectedResult);
    expect(service.remove).toHaveBeenCalledWith(roleId);
  });
});
