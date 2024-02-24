import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { ERRORS } from '../../../const';

export class BanUserDto {
  @ApiProperty({
    description: 'Reason of the ban',
    example: 'admin',
  })
  @IsString({ message: ERRORS.NOT_STRING })
  readonly banReason: string;

  @ApiProperty({
    description: 'ID of the user that should be banned',
    example: '1',
  })
  @IsNumber({}, { message: ERRORS.WRONG_ID })
  readonly userId: number;
}
