import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    return await this.rolesRepository.save(createRoleDto);
  }

  async getRoleByValue(value: string) {
    return await this.rolesRepository.findOne({ where: { value } });
  }
  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<UpdateResult> {
    return await this.rolesRepository.update(id, updateRoleDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.rolesRepository.delete(id);
  }
}
