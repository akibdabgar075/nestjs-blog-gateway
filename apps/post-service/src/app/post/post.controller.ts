import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Post as PostEntity } from './entities/post.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from './commands/create-post.command';
import { GetAllPostsQuery } from './queries/get-all-posts.query';
import { UpdatePostCommand } from './commands/update-post.command';
import { DeletePostCommand } from './commands/delete-post.command';
import { GetPostsQuery } from './queries/get-post.query';

// @Controller()
// export class PostController {
//   constructor(private readonly postService: PostService) {}

//   @MessagePattern('create_post')
//   create(@Payload() data: Partial<PostEntity>) {
//     return this.postService.create(data);
//   }

//   @MessagePattern('get_all_posts')
//   findAll() {
//     return this.postService.findAll();
//   }

//   @MessagePattern('get_post')
//   findOne(@Payload() id: number) {
//     return this.postService.findOne(id);
//   }

//   @MessagePattern('update_post')
//   update(@Payload() payload: { id: number; [key: string]: number }) {
//     const { id, ...data } = payload;
//     return this.postService.update(id, data);
//   }

//   @MessagePattern('delete_post')
//   remove(@Payload() id: number) {
//     return this.postService.remove(id);
//   }
// }

@Controller()
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @MessagePattern('create_post')
  create(@Payload() data: Partial<PostEntity>) {
    return this.commandBus.execute(new CreatePostCommand(data));
  }

  @MessagePattern('get_all_posts')
  findAll() {
    return this.queryBus.execute(new GetAllPostsQuery());
  }

  @MessagePattern('get_post')
  findOne(@Payload() id: number) {
    return this.queryBus.execute(new GetPostsQuery(id));
  }

  @MessagePattern('update_post')
  update(@Payload() payload: { id: number; [key: string]: number }) {
    const { id, ...data } = payload;
    console.log(payload, 'payload');

    return this.commandBus.execute(new UpdatePostCommand(id, data));
  }

  @MessagePattern('delete_post')
  remove(@Payload() id: number) {
    return this.commandBus.execute(new DeletePostCommand(id));
  }
}
