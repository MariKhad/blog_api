import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { DEFAULTS, ERRORS } from '../../const';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rolesService: RolesService,
    private fileService: FilesService,
  ) {}

  async create(createUserDto: CreateUserDto, image: any) {
    const filename = async () => {
      if (!image) {
        return DEFAULTS.AVATAR;
      } else {
        return await this.fileService.createFile(image);
      }
    };
    const user = this.userRepository.create({
      ...createUserDto,
      avatar: await filename(),
    });
    const role = await this.rolesService.getRoleByValue(DEFAULTS.ROLE);
    if (!role) {
      throw new HttpException(ERRORS.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    user.roles = [role];

    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find({ relations: ['roles'] });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async addRole(addRoleDto: AddRoleDto) {
    const user = await this.userRepository.findOne({
      where: { id: addRoleDto.userId },
    });
    const role = await this.rolesService.getRoleByValue(addRoleDto.value);
    if (!role || !user) {
      throw new HttpException(
        ERRORS.USER_OR_ROLE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    user.roles.push(role);
    await this.userRepository.save(user);
    return addRoleDto;
  }

  async banUser(banUserDto: BanUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: banUserDto.userId },
    });
    if (!user) {
      throw new HttpException(ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    user.banned = true;
    user.banReason = banUserDto.banReason;
    await this.userRepository.save(user);
    return user;
  }
}
