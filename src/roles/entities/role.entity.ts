import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  value: string;

  @Column({ nullable: false })
  description: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
  userRoles: any;
}
