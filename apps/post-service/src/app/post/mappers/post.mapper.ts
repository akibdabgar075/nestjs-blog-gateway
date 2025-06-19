// mappers/post.mapper.ts
import { CreatePostDto } from '@workspace/dto';
import { Post } from '../entities/post.entity';

export class CreatePostMapper {
  static toEntity(dto: Partial<CreatePostDto>): Post {
    const post = new Post();
    post.title = dto.title?.trim();
    post.content = dto.content;
    return post;
  }

  static toDto(entity: Post): CreatePostDto {
    return {
      id: entity.id,
      title: entity.title,
      content: entity.content,
    };
  }
}
