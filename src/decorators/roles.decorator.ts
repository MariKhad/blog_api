import { SetMetadata } from '@nestjs/common';
import { Role } from '../roles/entities/role.entity';

export const ROLES_KEY = 'roles';

const role: Role = new Role();
const value: string = role.value;
export const Roles = (...roles: (typeof value)[]) =>
  SetMetadata(ROLES_KEY, roles);
