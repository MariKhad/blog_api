import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { ERRORS, FIELDS } from '../../../const';

export class CreateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'Article title',
  })
  @IsString({ message: `${FIELDS.TITLE} ${ERRORS.NOT_STRING}` })
  @Length(10, 100, { message: ERRORS.WRONG_TITLE_LENGTH })
  readonly title: string;

  @ApiProperty({
    description: 'Content of the article',
    example: 'Lorem ipsum dolor, lorem ipsum dolor',
  })
  @IsString({ message: `${FIELDS.CONTENT} ${ERRORS.NOT_STRING}` })
  @Length(50, 2000, { message: ERRORS.WRONG_ARTICLE_LENGTH })
  readonly content: string;

  @ApiProperty({
    description: 'ID of the user to whom the role is added',
    example: '1',
  })
  @IsOptional()
  @IsString({ message: `${FIELDS.SLUG} ${ERRORS.NOT_STRING}` })
  slug?: string;
}
