import { Post } from '../entities/post.entity';

export class CreatePostCommand {
  constructor(public readonly data: Partial<Post>) {}
}
