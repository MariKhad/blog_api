import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FilesService } from '../files/files.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';
import { ConfigModule } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import {
  getRandomUser,
  getRandomUserNoName,
  mockAddRoleDto,
  mockBanUserDto,
  mockCreatedUser,
} from '../fixtures/userFixtures';
import { mockResult, wrongId } from '../fixtures/commonFixtures';
import { ERRORS } from '../../const';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';

describe('UsersController', () => {
  let controller: UsersController;
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
      controllers: [UsersController],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/POST /users/ should create a new user', async () => {
    const createUserDto = getRandomUser() as CreateUserDto;

    jest.spyOn(service, 'create').mockResolvedValue(mockCreatedUser);
    const result = await controller.create(createUserDto, null);
    expect(result).toEqual(mockCreatedUser);
  });

  it('/POST /users/ able to throw error on wrong user info', async () => {
    const userWithoutName = getRandomUserNoName() as CreateUserDto;
    jest
      .spyOn(service, 'create')
      .mockRejectedValue(
        new HttpException(ERRORS.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND),
      );
    await expect(controller.create(userWithoutName, null)).rejects.toThrow(
      HttpException,
    );
  });

  it('/GET users/:id, able to find user by id', async () => {
    const userId = 'someId';
    const foundUser = mockCreatedUser;
    jest.spyOn(service, 'findById').mockResolvedValue(foundUser);
    const result = await controller.findById(userId);
    expect(result).toEqual(foundUser);
  });

  it('/GET /users/:id, able to throw error on wrong user id', async () => {
    jest
      .spyOn(service, 'findById')
      .mockRejectedValue(new Error(ERRORS.USER_NOT_FOUND));
    await expect(controller.findById(wrongId)).rejects.toThrow(
      ERRORS.USER_NOT_FOUND,
    );
  });

  it('/GET users, able to find all users', async () => {
    const users = [{ ...mockCreatedUser }, { ...mockCreatedUser }] as User[];

    jest.spyOn(service, 'findAll').mockResolvedValue(users);
    const result = await controller.findAll();

    expect(result).toEqual(users);
  });

  it('/POST users/role, able to add a role', async () => {
    const addRoleDto = mockAddRoleDto;
    const expectedResult = mockAddRoleDto;

    jest.spyOn(service, 'addRole').mockResolvedValue(expectedResult);
    const result = await controller.addRole(addRoleDto);

    expect(result).toEqual(expectedResult);
  });

  it('/POST /users/ban should successfully ban a user', async () => {
    const banUserDto = mockBanUserDto;
    const mockBannedUser = { ...mockCreatedUser, ...banUserDto, ban: true };
    jest.spyOn(service, 'banUser').mockResolvedValue(mockBannedUser);

    const result = await controller.addBan(banUserDto);

    expect(result).toEqual(mockBannedUser);
  });

  it('/PATCH /users/:id should successfully update a user', async () => {
    const userId = wrongId;
    const updateUserDto = getRandomUserNoName();
    const expectedResult = mockResult as UpdateResult;

    jest.spyOn(service, 'update').mockResolvedValue(expectedResult);
    const result = await controller.update(userId, updateUserDto);

    expect(result).toEqual(expectedResult);
  });

  it('/PATCH /users/:id should throw NotFoundException for invalid user id', async () => {
    const userId = wrongId;
    const updateUserDto = getRandomUserNoName();
    jest
      .spyOn(service, 'update')
      .mockRejectedValue(new NotFoundException(ERRORS.USER_NOT_FOUND));
    await expect(controller.update(userId, updateUserDto)).rejects.toThrow(
      ERRORS.USER_NOT_FOUND,
    );
  });

  it('/DELETE /users/:id should successfully delete a user', async () => {
    const userId = wrongId;
    const expectedResult = mockResult as DeleteResult;

    jest.spyOn(service, 'remove').mockResolvedValue(expectedResult);
    const result = await controller.remove(userId);

    expect(result).toEqual(expectedResult);
  });

  it('/DELETE /users/:id should throw NotFoundException for invalid user id', async () => {
    const userId = wrongId;
    jest
      .spyOn(service, 'remove')
      .mockRejectedValue(new NotFoundException(ERRORS.USER_NOT_FOUND));
    await expect(controller.remove(userId)).rejects.toThrow(
      ERRORS.USER_NOT_FOUND,
    );
  });
});
