import { CreatePostDto } from '@workspace/dto';

export class UpdatePostCommand {
  constructor(
    public readonly id: number,
    public readonly data: Partial<CreatePostDto>,
    public readonly userId: number
  ) {}
}
