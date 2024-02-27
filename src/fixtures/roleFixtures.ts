import { Role } from '../roles/entities/role.entity';
import { randomId } from './commonFixtures';
import { CreateRoleDto } from '../roles/dto/create-role.dto';

export const mockCreateRoleDto = {
  value: 'someRole',
  description: 'someDescription',
} as CreateRoleDto;

export const mockCreatedRole = {
  id: randomId(),
  ...mockCreateRoleDto,
} as Role;
