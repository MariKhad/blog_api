import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { AddRoleDto } from 'src/users/dto/add-role.dto';
import { BanUserDto } from 'src/users/dto/ban-user.dto';
import { randomId } from './commonFixtures';

export const someRole = 'user' as unknown as Role;

export const getRandomUser = (): CreateUserDto => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

export const getRandomUserNoName = (): UpdateUserDto => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

export const getRandomUserNoEmail = (): UpdateUserDto => {
  return {
    username: faker.person.fullName(),
    password: faker.internet.password(),
  };
};

export const getRandomUserNoPassword = (): UpdateUserDto => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
  };
};

export const mockCreatedUser = {
  id: randomId(),
  ...getRandomUser(),
  roles: [someRole],
  avatar: 'default_avatar.jpg',
  banned: false,
  banReason: 'some reason',
  articles: [],
} as User;

export const mockAddRoleDto = {
  value: 'someRole',
  userId: randomId(),
} as AddRoleDto;

export const mockBanUserDto = {
  userId: randomId(),
  banReason: 'some reason',
} as BanUserDto;
