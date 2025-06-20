import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';

import { CreatePostHandler } from './commands/handlers/create-post.handler';
import { GetAllPostsHandler } from './queries/handlers/get-all-posts.handler';
import { UpdatePostHandler } from './commands/handlers/update-post.handler';
import { DeletePostHandler } from './commands/handlers/delete-post.handler';
import { GetPostsHandler } from './queries/handlers/get-post.handler';
import { Tag } from './entities/tag.entity';

const CommandHandlers = [
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
];
const QueryHandlers = [GetAllPostsHandler, GetPostsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag]), CqrsModule],
  controllers: [PostController],
  providers: [PostService, ...CommandHandlers, ...QueryHandlers],
})
export class PostModule {}
