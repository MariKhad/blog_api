import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create a new Role' })
  @ApiResponse({ status: 201, type: Role, description: 'Create a new role' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @ApiOperation({ summary: 'Show role by value' })
  @Get('/:value')
  findOne(@Param('value') value: string) {
    return this.rolesService.getRoleByValue(value.toLowerCase());
  }

  @ApiOperation({ summary: 'Update role by id' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch('/:id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Delete role by id' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.rolesService.remove(id);
  }
}
