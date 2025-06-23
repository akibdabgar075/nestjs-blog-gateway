import { CreateCommentDto } from '../dto/create-comment.dto';

export class CreateCommentCommand {
  constructor(public readonly data: CreateCommentDto) {}
}
