import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { lastValueFrom } from 'rxjs';
import { PostWithCommentsDto } from './dto/getPostWithComents.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthRequest } from '../interface/user-info.interface';

@ApiTags('post')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PostController {
  constructor(
    @Inject('POST_SERVICE') private readonly client: ClientProxy,
    @Inject('COMMENT_SERVICE') private readonly commentClient: ClientProxy
  ) {}

  @Post('create-post')
  createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: AuthRequest
  ) {
    const user = req.user;

    const data = { ...createPostDto, authorId: user.userId };

    return this.client.send('create_post', data);
  }

  @Get('get-all-post')
  getAllPosts() {
    return this.client.send('get_all_posts', {});
  }

  @Get('get-post/:id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('get_post', id);
  }

  @Put('update-post/:id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: Partial<UpdatePostDto>,
    @Request() req: AuthRequest
  ) {
    const user = req.user;
    return this.client.send('update_post', {
      id,
      data: updatePostDto,
      userId: user.userId,
    });
  }

  @Delete('delete-post/:id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    console.log(typeof id, 'typeoffffffffffffffffffffffffffffffffffff');

    return this.client.send('delete_post', id);
  }

  @Get('get-posts-with-comments/:id')
  async getPostWithComments(
    @Param('id', ParseIntPipe) id: number
  ): Promise<PostWithCommentsDto | null> {
    const post = await lastValueFrom(this.client.send('get_post', id));

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    const comments = await lastValueFrom(
      this.commentClient.send('get_comments_by_postId', id)
    );

    return {
      postId: post.id,
      title: post.title,
      content: post.content,
      comments: comments || [],
    };
  }

  @Get('get-all-posts-with-comments')
  async getAllPostsWithComments(): Promise<PostWithCommentsDto[]> {
    // 1. Get all posts
    const posts = await lastValueFrom(this.client.send('get_all_posts', {}));

    if (!posts || posts.length === 0) {
      return [];
    }

    // 2. For each post, fetch its comments
    const postsWithComments = await Promise.all(
      posts.map((post: PostWithCommentsDto) => {
        const comments = lastValueFrom(
          this.commentClient.send('get_comments_by_postId', post.postId)
        );

        return {
          title: post.title,
          content: post.content,
          comments: comments || [],
        };
      })
    );

    return postsWithComments;
  }
}
