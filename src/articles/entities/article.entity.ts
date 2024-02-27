import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DEFAULTS } from '../../../const';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'articles' })
export class Article {
  @ApiProperty({
    description: 'Uniq identifier',
    example: 1,
    required: true,
  })
  @PrimaryGeneratedColumn({ name: 'article_id' })
  id: number;

  @ApiProperty({
    description: 'Uniq text article identifier',
    example: 'test-article',
    required: true,
  })
  @Column({
    unique: true,
    nullable: false,
  })
  slug: string;

  @ApiProperty({
    description: 'Title from 10 to 100 characters long',
    example: 'Title',
    required: true,
  })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({
    description: 'Title from 50 to 2000 characters long',
    example:
      'Lorem ipsum dolor, lorem ipsum dolor, lorem ipsum dolor, lorem ipsum dolor, lorem ipsum dolor, lorem ipsum dolor, lorem ipsum dolor, lorem ipsum dolor, lorem ipsum dolor.',
    required: true,
  })
  @Column({ nullable: false })
  content: string;

  @ApiProperty({ description: 'Path to article picture' })
  @Column({ default: DEFAULTS.PLACEHOLDER })
  image: string;

  @ApiProperty({ description: 'Date of creation' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date of update' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({ name: 'user_id' })
  author: User;
}
