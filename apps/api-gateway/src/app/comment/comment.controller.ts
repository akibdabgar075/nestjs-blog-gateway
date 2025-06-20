import { ClientProxy } from '@nestjs/microservices';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(
    @Inject('COMMENT_SERVICE') private readonly client: ClientProxy
  ) {}

  @Post()
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.client.send('create_comment', createCommentDto);
  }

  @Get()
  getAllComments() {
    return this.client.send('find_all_comments', {});
  }

  @Get(':id')
  getCommentById(@Param('id') id: number) {
    return this.client.send('find_one_comment', id);
  }
  @Put(':id')
  updateComment(@Param('id') id: number, updateCommentDto: UpdateCommentDto) {
    return this.client.send('update_comment', { id, updateCommentDto });
  }

  @Delete(':id')
  deleteComment(@Param('id') id: number) {
    return this.client.send('remove_comment', id);
  }
}
