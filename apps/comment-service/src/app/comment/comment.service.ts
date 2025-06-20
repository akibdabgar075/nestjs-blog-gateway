import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    return this.commentRepository.save(comment);
  }

  findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  findOne(id: number): Promise<Comment | null> {
    return this.commentRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto
  ): Promise<Comment | null> {
    await this.commentRepository.update(id, updateCommentDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }

  findByPostId(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      select: ['id', 'postId', 'message'],
      where: { postId },
      order: { createdAt: 'DESC' },
    });
  }
}
