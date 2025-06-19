import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostMapper } from './mappers/post.mapper';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>
  ) {}

  async create(data: Partial<Post>) {
    try {
      const postEntity = CreatePostMapper.toEntity(data);
      console.log(postEntity, 'postEntity');

      await this.postRepo.save(postEntity);
      const postDto = CreatePostMapper.toDto(postEntity);
      return postDto;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  async findAll() {
    try {
      return await this.postRepo.find({ select: ['id', 'title', 'content'] });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to fetch posts');
    }
  }

  async findOne(id: number) {
    try {
      console.log('post service cal');

      const post = await this.postRepo.findOneBy({ id });
      if (!post) throw new NotFoundException('Post not found');
      return post;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch post');
    }
  }

  async update(id: number, data: Partial<Post>) {
    try {
      const result = await this.postRepo.update(id, data);
      if (!result.affected) throw new NotFoundException('Post not found');

      const updated = await this.postRepo.findOneBy({ id });
      if (!updated) throw new NotFoundException('Post not found after update');

      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update post');
    }
  }

  async remove(id: number) {
    try {
      const result = await this.postRepo.delete(id);
      if (!result.affected) throw new NotFoundException('Post not found');
      return { deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete post');
    }
  }
}
