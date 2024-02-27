import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'roles' })
export class Role {
  @ApiProperty({
    description: 'Uniq identifier',
    example: '1',
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique value of user role',
    example: 'Admin',
    required: true,
  })
  @Column({ unique: true, nullable: false })
  value: string;

  @ApiProperty({
    description: 'Description of user role',
    example: 'Some description',
    required: true,
  })
  @Column({ nullable: false })
  description: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
  userRoles: any;
}
