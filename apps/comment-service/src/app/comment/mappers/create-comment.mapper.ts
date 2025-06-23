// mappers/comment.mapper.ts

import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../entities/comment.entity';

export class CommentMapper {
  static toEntity(dto: Partial<CreateCommentDto>): Comment {
    const comment = new Comment();
    comment.postId = dto.postId ?? null;
    comment.authorId = dto.authorId ?? null;
    comment.message = dto.message?.trim() ?? '';
    return comment;
  }

  static toDto(entity: Comment): CreateCommentDto & { commentId: number } {
    return {
      commentId: entity.id,
      postId: entity.postId,
      authorId: entity.authorId,
      message: entity.message,
    };
  }

  //   static updateEntity(
  //     comment: Comment,
  //     dto: Partial<CreateCommentDto>
  //   ): Comment {
  //     if (dto.message) comment.message = dto.message.trim();
  //     // Usually you wouldn't update postId or userId on a comment update, but you can add logic if needed
  //     return comment;
  //   }
}
