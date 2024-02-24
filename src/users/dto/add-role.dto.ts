import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { ERRORS } from '../../../const';

export class AddRoleDto {
  @ApiProperty({
    description: 'Role value',
    example: 'admin',
  })
  @IsString({ message: ERRORS.NOT_STRING })
  readonly value: string;

  @ApiProperty({
    description: 'ID of the user to whom the role is added',
    example: '1',
  })
  @IsNumber({}, { message: ERRORS.WRONG_ID })
  readonly userId: number;
}
