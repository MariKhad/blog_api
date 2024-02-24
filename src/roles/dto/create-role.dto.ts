import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Value of user role',
    example: 'Admin',
  })
  readonly value: string;
  @ApiProperty({
    description: 'Description of user role',
    example: 'some description',
  })
  readonly description: string;
}
