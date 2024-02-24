import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';
import { ERRORS, FIELDS } from '../../../const';

export class CreateUserDto {
  @ApiProperty({
    description: "User's nichname for login",
    example: 'RobStark89',
  })
  @IsString({ message: `${FIELDS.USERNAME} ${ERRORS.NOT_STRING}` })
  readonly username: string;

  @ApiProperty({
    description: "User's email, should be unique",
    example: 'example@email.com',
  })
  @IsString({ message: `${FIELDS.EMAIL} ${ERRORS.NOT_STRING}` })
  @IsEmail({}, { message: ERRORS.WRONG_EMAIL })
  readonly email: string;

  @ApiProperty({
    description: 'Just good difficult password from 4 to 16 characters',
  })
  @IsString({ message: `${FIELDS.PASSWORD} ${ERRORS.NOT_STRING}` })
  @Length(4, 16, { message: ERRORS.WRONG_PASS_LENGTH })
  password: string;
}
