import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
@Index('IDX_COMMENT_AUTHOR', ['authorId'])
@Index('IDX_COMMENT_POST', ['postId'])
@Index('IDX_COMMENT_ISVIEW', ['isView'])
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  @Column()
  authorId: number;

  @Column('text')
  message: string;

  @Column({ default: false })
  isView: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
