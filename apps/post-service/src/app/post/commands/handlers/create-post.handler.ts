import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../create-post.command';
import { PostService } from '../../post.service';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private readonly postService: PostService) {}

  async execute(command: CreatePostCommand) {
    return this.postService.create(command.data);
  }
}
