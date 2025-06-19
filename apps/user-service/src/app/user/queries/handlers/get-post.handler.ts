// import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

// import { GetPostsQuery } from '../get-post.query';
// import { UserService } from '../../user.service';

// @QueryHandler(GetPostsQuery)
// export class GetPostsHandler implements IQueryHandler<GetPostsQuery> {
//   constructor(private readonly userService: UserService) {}

//   async execute(query: GetPostsQuery) {
//     // return this.userService.findOne(query.id);
//   }
// }
