// mappers/post.mapper.ts
import { CreatePostDto } from '@workspace/dto';
import { Post } from '../entities/post.entity';
import { Tag } from '../entities/tag.entity';

export class CreatePostMapper {
  static toEntity(dto: Partial<CreatePostDto>): Post {
    const post = new Post();
    post.title = dto.title?.trim() ?? '';
    post.content = dto.content ?? '';
    post.published = dto.published ?? false;
    post.authorId = dto.authorId ?? null;

    if (dto.tags && Array.isArray(dto.tags)) {
      post.tags = dto.tags.map((tagDto) => {
        const tag = new Tag();
        tag.name = tagDto.name.trim();
        return tag;
      });
    } else {
      post.tags = [];
    }

    return post;
  }

  static toDto(entity: Post): CreatePostDto {
    return {
      postId: entity.id,
      title: entity.title,
      content: entity.content,
      published: entity.published,
      authorId: entity.authorId,
      tags: entity.tags?.map((tag) => ({ name: tag.name })),
    };
  }

  static updateEntity(post: Post, dto: Partial<CreatePostDto>): Post {
    if (dto.title) post.title = dto.title.trim();
    if (dto.content) post.content = dto.content;
    if (dto.published) post.published = dto.published;

    if (dto.tags && Array.isArray(dto.tags)) {
      post.tags = dto.tags.map((tagDto) => {
        const tag = new Tag();
        tag.name = tagDto.name.trim().toLowerCase();
        return tag;
      });
    }
    return post;
  }
}
