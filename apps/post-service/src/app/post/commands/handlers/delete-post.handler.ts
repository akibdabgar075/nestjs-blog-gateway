import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostService } from '../../post.service';
import { DeletePostCommand } from '../delete-post.command';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly postService: PostService) {}

  async execute(command: DeletePostCommand) {
    return this.postService.remove(command.id);
  }
}
