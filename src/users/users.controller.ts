import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../decorators/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, type: User, description: 'Create a new user' })
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(@Body() createUserDto: CreateUserDto, @UploadedFile() image: any) {
    return this.usersService.create(createUserDto, image);
  }

  @ApiOperation({ summary: 'Show all users' })
  @ApiResponse({ status: 200, type: [User], description: 'Show all users' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Show user by id' })
  @ApiResponse({ status: 200, type: [User], description: 'Show user by Id' })
  @Public()
  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @ApiOperation({ summary: 'Adding a role' })
  @ApiResponse({ status: 200, description: 'Adding a role' })
  @Post('/role')
  addRole(@Body() addRoleDto: AddRoleDto) {
    return this.usersService.addRole(addRoleDto);
  }

  @ApiOperation({ summary: 'Ban user' })
  @ApiResponse({ status: 200, description: 'Ban user' })
  @Post('/ban')
  addBab(@Body() banUserDto: BanUserDto) {
    return this.usersService.banUser(banUserDto);
  }

  @ApiOperation({ summary: "Delete article, that's is found by id" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @ApiOperation({ summary: 'Update user, that is found by id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateUserDto) {
    return this.usersService.update(+id, updateArticleDto);
  }
}
