import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({
    description: "User's email, should be unique",
    example: 'example@email.com',
  })
  readonly email: string;
  @ApiProperty({ description: 'Just good dificult password' })
  readonly password: string;
}
