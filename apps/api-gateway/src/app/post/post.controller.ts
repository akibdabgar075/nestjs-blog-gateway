import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { lastValueFrom } from 'rxjs';
import { PostWithCommentsDto } from './dto/getPostWithComents.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PostController {
  constructor(
    @Inject('POST_SERVICE') private readonly client: ClientProxy,
    @Inject('COMMENT_SERVICE') private readonly commentClient: ClientProxy
  ) {}

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.client.send('create_post', createPostDto);
  }

  @Get()
  getAllPosts() {
    return this.client.send('get_all_posts', {});
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.client.send('get_post', id);
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.client.send('update_post', { id, ...updatePostDto });
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.client.send('delete_post', id);
  }

  @Get(':id')
  async getPostWithComments(
    @Param('id') id: string
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

  @Get()
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
