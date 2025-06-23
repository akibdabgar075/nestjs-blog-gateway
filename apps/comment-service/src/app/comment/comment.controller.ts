import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentCommand } from './commands/create-comment.commands';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller()
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @MessagePattern('create_comment')
  create(@Payload() createCommentDto: CreateCommentDto) {
    console.log(createCommentDto, 'createCommentDto');
    return this.commandBus.execute(new CreateCommentCommand(createCommentDto));
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

// @MessagePattern('create_post')
// create(@Payload() data: Partial<PostEntity>) {
//   return this.commandBus.execute(new CreatePostCommand(data));
// }

// @MessagePattern('get_all_posts')
// findAll() {
//   return this.queryBus.execute(new GetAllPostsQuery());
// }

// @MessagePattern('get_post')
// findOne(@Payload() id: number) {
//   return this.queryBus.execute(new GetPostsQuery(id));
// }

// @MessagePattern('update_post')
// update(
//   @Payload()
//   payload: {
//     id: number;
//     data: Partial<CreatePostDto>;
//     userId: number;
//   }
// ) {
//   const { id, data, userId } = payload;

//   return this.commandBus.execute(new UpdatePostCommand(id, data, userId));
// }

// @MessagePattern('delete_post')
// remove(@Payload() id: number) {
//   return this.commandBus.execute(new DeletePostCommand(id));
// }
