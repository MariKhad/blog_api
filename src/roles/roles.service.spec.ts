import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { mockCreateRoleDto, mockCreatedRole } from '../fixtures/roleFixtures';
import { DEFAULTS } from '../../const';
import { mockResult, randomId } from '../fixtures/commonFixtures';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateRoleDto } from './dto/update-role.dto';

const mockRoleRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('RolesService', () => {
  let service: RolesService;
  const ROLE_REPOSITORY_TOKEN = getRepositoryToken(Role);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: mockRoleRepository,
        },
      ],
      imports: [ConfigModule.forRoot()],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRole', () => {
    it('should create a role', async () => {
      const createRoleDto = mockCreateRoleDto;
      const createdRole = mockCreatedRole;
      mockRoleRepository.save.mockResolvedValue(createdRole);

      const result = await service.createRole(createRoleDto);

      expect(result).toEqual(createdRole);
      expect(mockRoleRepository.save).toHaveBeenCalledWith(createRoleDto);
    });
  });

  describe('getRoleByValue', () => {
    it('should get a role by value', async () => {
      const value = DEFAULTS.ROLE;
      const role = mockCreatedRole;
      mockRoleRepository.findOne.mockResolvedValue(role);

      const result = await service.getRoleByValue(value);

      expect(result).toEqual(role);
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({
        where: { value },
      });
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const id = randomId();
      const updateRoleDto = mockCreateRoleDto as UpdateRoleDto;
      const updateResult = mockResult as UpdateResult;
      mockRoleRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(id, updateRoleDto);

      expect(result).toEqual(updateResult);
      expect(mockRoleRepository.update).toHaveBeenCalledWith(id, updateRoleDto);
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const id = randomId();
      const deleteResult = mockResult as DeleteResult;
      mockRoleRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(id);

      expect(result).toEqual(deleteResult);
      expect(mockRoleRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
