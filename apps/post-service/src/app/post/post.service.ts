import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostMapper } from './mappers/post.mapper';
import { CreatePostDto } from '@workspace/dto';
import { Tag } from './entities/tag.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(data: CreatePostDto) {
    try {
      const post = new Post();
      post.title = data.title?.trim();
      post.content = data.content ?? '';
      post.published = data.published ?? false;
      post.authorId = data.authorId ?? null;

      const tagNames =
        data.tags?.map((tag) => tag.name.trim().toLowerCase()) || [];

      const existingTags = await this.tagRepo.find({
        where: tagNames.map((name) => ({ name })),
      });

      const existingTagNames = existingTags.map((tag) => tag.name);

      const newTags = tagNames
        .filter((name) => !existingTagNames.includes(name))
        .map((name) => {
          const tag = new Tag();
          tag.name = name;
          return tag;
        });

      if (newTags?.length > 0) {
        await this.tagRepo.save(newTags);
      }

      post.tags = [...existingTags, ...newTags];

      const savedPost = await this.postRepo.save(post);

      return CreatePostMapper.toDto(savedPost);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  async findAll() {
    try {
      const cacheKey = 'posts:all';

      const cached = await this.cacheManager.get<CreatePostDto[]>(cacheKey);
      console.log(cached, 'cachedcachedcachedcached');

      if (cached) {
        return cached; // cached is already PostDto[]
        console.log(cached, 'cachedcached');
      }

      // fetch posts from DB & map
      const posts = await this.postRepo.find({
        select: ['id', 'title', 'content', 'authorId'],
      });

      const mapped: CreatePostDto[] = posts?.map(CreatePostMapper.toDto);

      await this.cacheManager.set(cacheKey, mapped, 300);
      const cached1 = await this.cacheManager.get<CreatePostDto[]>(cacheKey);
      console.log(cached1, 'cached1cached1cached1');

      return mapped;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch posts');
    }
  }

  async findOne(id: number) {
    try {
      const post = await this.postRepo.findOne({
        select: ['id', 'title', 'content', 'authorId'],
        where: { id },
      });
      if (!post) throw new NotFoundException('Post not found');
      return CreatePostMapper.toDto(post);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch post');
    }
  }

  async update(
    id: number,
    data: Partial<CreatePostDto>,
    currentUserId: number
  ) {
    try {
      const post = await this.postRepo.findOne({
        where: { id },
        relations: ['tags'],
      });

      if (!post) throw new NotFoundException('Post not found');

      if (post.authorId !== currentUserId) {
        throw new ForbiddenException('You are not allowed to update this post');
      }

      CreatePostMapper.updateEntity(post, data);

      if (data?.tags) {
        const tagNames = data.tags.map((t) => t.name.trim().toLowerCase());

        const existingTags = await this.tagRepo.find({
          where: tagNames.map((name) => ({ name })),
        });

        const existingTagNames = existingTags.map((t) => t.name);

        const newTags = tagNames
          .filter((name) => !existingTagNames.includes(name))
          .map((name) => {
            const tag = new Tag();
            tag.name = name;
            return tag;
          });

        if (newTags.length) await this.tagRepo.save(newTags);

        post.tags = [...existingTags, ...newTags];
      }

      await this.postRepo.save(post);

      const updated = await this.postRepo.findOne({
        where: { id },
        relations: ['tags'],
      });

      return CreatePostMapper.toDto(updated);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to update post');
    }
  }

  async remove(id: number) {
    try {
      const result = await this.postRepo.softDelete(id);

      if (!result.affected) throw new NotFoundException('Post not found');
      return { deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete post');
    }
  }
}
