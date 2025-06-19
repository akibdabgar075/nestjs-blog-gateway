import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @MessagePattern('create_comment')
  create(@Payload() createCommentDto: CreateCommentDto) {
    console.log('');

    return this.commentService.create(createCommentDto);
  }

  @MessagePattern('find_all_comments')
  findAll() {
    return this.commentService.findAll();
  }

  @MessagePattern('find_one_comment')
  findOne(@Payload() id: number) {
    return this.commentService.findOne(id);
  }

  @MessagePattern('update_comment')
  update(@Payload() data: { id: number; updateCommentDto: UpdateCommentDto }) {
    const { id, updateCommentDto } = data;
    return this.commentService.update(id, updateCommentDto);
  }

  @MessagePattern('remove_comment')
  remove(@Payload() id: number) {
    return this.commentService.remove(id);
  }

  @MessagePattern('get_comments_by_postId')
  async getCommentsByPost(@Payload() postId: number) {
    return this.commentService.findByPostId(postId);
  }
}
