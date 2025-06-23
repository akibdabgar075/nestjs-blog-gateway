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
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthRequest } from '../interface/user-info.interface';

@ApiTags('comments')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class CommentController {
  constructor(
    @Inject('COMMENT_SERVICE') private readonly client: ClientProxy
  ) {}

  @Post('create-comment')
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: AuthRequest
  ) {
    const user = req.user;
    const data = { ...createCommentDto, authorId: user.userId };
    return this.client.send('create_comment', data);
  }

  @Get('get-all-comments')
  getAllComments() {
    return this.client.send('find_all_comments', {});
  }

  @Get('get-comment/:id')
  getCommentById(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('find_one_comment', id);
  }
  @Put('update-comment/:id')
  updateComment(
    @Param('id', ParseIntPipe) id: number,
    updateCommentDto: UpdateCommentDto
  ) {
    return this.client.send('update_comment', { id, updateCommentDto });
  }

  @Delete('delete-comment/:id')
  deleteComment(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('remove_comment', id);
  }
}
