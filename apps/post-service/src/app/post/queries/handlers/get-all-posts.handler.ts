import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPostsQuery } from '../get-all-posts.query';
import { PostService } from '../../post.service';

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsHandler implements IQueryHandler<GetAllPostsQuery> {
  constructor(private readonly postService: PostService) {}

  async execute(query: GetAllPostsQuery) {
    return this.postService.findAll();
  }
}
