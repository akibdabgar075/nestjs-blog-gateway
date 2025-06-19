import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostService } from '../../post.service';
import { GetPostsQuery } from '../get-post.query';

@QueryHandler(GetPostsQuery)
export class GetPostsHandler implements IQueryHandler<GetPostsQuery> {
  constructor(private readonly postService: PostService) {}

  async execute(query: GetPostsQuery) {
    return this.postService.findOne(query.id);
  }
}
