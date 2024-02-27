import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Article } from '../../articles/entities/article.entity';
import { DEFAULTS } from '../../../const';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    description: 'Uniq identifier',
    example: 1,
    required: true,
  })
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @ApiProperty({
    description: 'Username for login',
    example: 'RobStark89',
    required: true,
  })
  @Column({ unique: true, nullable: false })
  username: string;

  @ApiProperty({
    description: "User's email, should be unique",
    example: 'example@email.com',
    required: true,
  })
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty({ description: 'Path to user avatar' })
  @Column({ default: DEFAULTS.AVATAR })
  avatar: string;

  @ApiProperty({ description: 'Just good dificult password' })
  @Column({ nullable: false })
  password: string;

  @ApiProperty({ description: 'The user is banned or not' })
  @Column({ default: false })
  banned: boolean;

  @ApiProperty({ description: 'The reason why the user got the ban' })
  @Column({ nullable: true })
  banReason: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Article, (article) => article.author, {
    onDelete: 'CASCADE',
  })
  articles: Article[];
}
