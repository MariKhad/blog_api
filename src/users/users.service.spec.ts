import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { FilesService } from '../files/files.service';
import { RolesService } from '../roles/roles.service';
import { ConfigModule } from '@nestjs/config';
import {
  getRandomUser,
  getRandomUserNoName,
  mockAddRoleDto,
  mockBanUserDto,
  mockCreatedUser,
} from '../fixtures/userFixtures';
import { mockCreatedRole } from '../fixtures/roleFixtures';
import { mockResult, randomId } from '../fixtures/commonFixtures';
import { NotFoundException } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';

const mockUserRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockRoleRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let rolesService: RolesService;
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
          useValue: mockUserRepository,
        },
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: mockRoleRepository,
        },
        {
          provide: FilesService,
          useValue: {
            createFile: jest.fn().mockResolvedValue('avatar.jpg'),
          },
        },
        {
          provide: RolesService,
          useValue: {
            getRoleByValue: jest.fn().mockResolvedValue(mockCreatedRole),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = getRandomUser();
      const userMock = mockCreatedUser;

      mockUserRepository.create = jest.fn().mockReturnValue(userMock);
      mockUserRepository.save = jest.fn().mockResolvedValue(userMock);

      const result = await service.create(createUserDto, 'avatar.jpg');

      expect(result).toEqual(userMock);
      expect(mockUserRepository.create).toBeCalledWith(
        expect.objectContaining(createUserDto),
      );
      expect(mockUserRepository.save).toBeCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should find a user by ID', async () => {
      const id = randomId();
      const userMock = mockCreatedUser;
      mockUserRepository.findOne = jest.fn().mockResolvedValue(userMock);

      const result = await service.findById(id);

      expect(result).toEqual(userMock);
      expect(mockUserRepository.findOne).toBeCalledWith({
        relations: ['roles'],
        where: { id },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = randomId();
      mockUserRepository.findOne = jest.fn().mockResolvedValue(undefined);

      await expect(service.findById(id)).rejects.toThrowError(
        NotFoundException,
      );
      expect(mockUserRepository.findOne).toBeCalledWith({
        relations: ['roles'],
        where: { id },
      });
    });
  });

  describe('findAll', () => {
    it('should return all users with roles', async () => {
      const usersMock = [{ ...mockCreatedUser }, { ...mockCreatedUser }];
      mockUserRepository.find = jest.fn().mockResolvedValue(usersMock);

      const result = await service.findAll();

      expect(result).toEqual(usersMock);
      expect(mockUserRepository.find).toBeCalledWith({ relations: ['roles'] });
    });
  });

  describe('getUserByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const userMock = mockCreatedUser;
      mockUserRepository.findOne = jest.fn().mockResolvedValue(userMock);

      const result = await service.getUserByEmail(email);

      expect(result).toEqual(userMock);
      expect(mockUserRepository.findOne).toBeCalledWith({
        where: { email },
        relations: ['roles'],
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      const email = 'test@example.com';
      mockUserRepository.findOne = jest
        .fn()
        .mockRejectedValue(new NotFoundException());

      await expect(service.getUserByEmail(email)).rejects.toThrowError(
        NotFoundException,
      );
      expect(mockUserRepository.findOne).toBeCalledWith({
        where: { email },
        relations: ['roles'],
      });
    });
  });

  describe('update', () => {
    it('should update a user and return UpdateResult', async () => {
      const id = randomId();
      const updateUserDto = getRandomUserNoName();
      const updateResult = mockResult as UpdateResult;
      mockUserRepository.update = jest.fn().mockResolvedValue(updateResult);

      const result = await service.update(id, updateUserDto);

      expect(result).toEqual(updateResult);
      expect(mockUserRepository.update).toBeCalledWith(id, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user and return DeleteResult', async () => {
      const id = randomId();
      const deleteResult = mockResult as DeleteResult;
      mockUserRepository.delete = jest.fn().mockResolvedValue(deleteResult);

      const result = await service.remove(id);

      expect(result).toEqual(deleteResult);
      expect(mockUserRepository.delete).toBeCalledWith(id);
    });
  });

  describe('addRole', () => {
    it('should add role to user and return addRoleDto', async () => {
      const addRoleDto = mockAddRoleDto;
      const id = addRoleDto.userId;
      const value = addRoleDto.value;

      const userMock = mockCreatedUser;
      const roleMock = mockCreatedRole;

      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(userMock);
      jest.spyOn(mockUserRepository, 'save').mockResolvedValue(userMock);

      const result = await service.addRole(addRoleDto);

      expect(result).toEqual(addRoleDto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });

      expect(mockUserRepository.save).toHaveBeenCalledWith(userMock);
      expect(userMock.roles).toContain(roleMock);
    });

    it('should throw NotFoundException if user or role not found', async () => {
      const addRoleDto = mockAddRoleDto;
      const id = addRoleDto.userId;

      jest
        .spyOn(mockUserRepository, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(service.addRole(addRoleDto)).rejects.toThrowError(
        NotFoundException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('banUser', () => {
    it('should ban a user and return the user', async () => {
      const banUserDto = mockBanUserDto;
      const id = banUserDto.userId;

      const userMock = mockCreatedUser;
      mockUserRepository.findOne = jest.fn().mockResolvedValue(userMock);
      mockUserRepository.save = jest.fn().mockResolvedValue(userMock);

      const result = await service.banUser(banUserDto);

      expect(result).toEqual(userMock);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...userMock,
        banned: true,
        banReason: banUserDto.banReason,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      const banUserDto = mockBanUserDto;
      const id = banUserDto.userId;

      mockUserRepository.findOne = jest
        .fn()
        .mockRejectedValue(new NotFoundException());

      await expect(service.banUser(banUserDto)).rejects.toThrowError(
        NotFoundException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
