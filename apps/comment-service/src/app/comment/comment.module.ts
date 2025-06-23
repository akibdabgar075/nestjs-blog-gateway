import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from './entities/comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CreateCommentHandler } from './commands/handlers/create-comment.handler';
import { CqrsModule } from '@nestjs/cqrs';

const CommandHandlers = [CreateCommentHandler];
const QueryHandlers = [];
@Module({
  imports: [TypeOrmModule.forFeature([Comment]), CqrsModule],
  providers: [CommentService, ...CommandHandlers, ...QueryHandlers],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
