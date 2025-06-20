import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostCommand } from '../update-post.command';
import { PostService } from '../../post.service';

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(private readonly postService: PostService) {}

  async execute(command: UpdatePostCommand) {
    const { id, data, userId } = command;
    return this.postService.update(id, data, userId);
  }
}
