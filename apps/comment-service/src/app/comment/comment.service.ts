import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { CommentMapper } from './mappers/create-comment.mapper';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const comment = CommentMapper.toEntity(createCommentDto);
    const savedComment = await this.commentRepository.save(comment);

    return CommentMapper.toDto(savedComment);
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
    await this.commentRepository.softDelete(id);
  }

  findByPostId(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      select: ['id', 'postId', 'message'],
      where: { postId },
      order: { createdAt: 'DESC' },
    });
  }
}
