import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateCommentCommand } from '../create-comment.commands';
import { CommentService } from '../../comment.service';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private readonly commentService: CommentService) {}

  async execute(command: CreateCommentCommand) {
    return this.commentService.create(command.data);
  }
}
