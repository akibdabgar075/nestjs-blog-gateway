import { Post } from '../entities/post.entity';

export class UpdatePostCommand {
  constructor(
    public readonly id: number,
    public readonly data: Partial<Post>
  ) {}
}
