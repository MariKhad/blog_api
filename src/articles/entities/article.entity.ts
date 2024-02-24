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

@Entity({ name: 'articles' })
export class Article {
  @PrimaryGeneratedColumn({ name: 'article_id' })
  id: number;

  @Column({
    unique: true,
    nullable: true,
  })
  slug: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  content: string;

  @Column({ default: DEFAULTS.PLACEHOLDER })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({ name: 'user_id' })
  author: User;
}
