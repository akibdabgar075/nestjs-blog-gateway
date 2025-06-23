import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserMapper } from './mappers/create-user.mapper';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserResponse } from './interfaces/user-response.interface';
import { CreateUserInfo } from './interfaces/create-user.interface';
import { LoginInfo } from './interfaces/login.interface';
import { JwtService } from '@nestjs/jwt';
import { UserMapper } from './mappers/login-response.mapper';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(dto: CreateUserInfo): Promise<CreateUserResponse> {
    const user = CreateUserMapper.toEntity(dto);

    user.password = await bcrypt.hash(dto.password, 10);

    const saved = await this.userRepo.save(user);
    return CreateUserMapper.toResponseDto(saved);
  }

  async login(dto: LoginInfo) {
    try {
      const getUser = await this.userRepo.findOneBy({ email: dto.email });

      if (!getUser) {
        throw new RpcException('Invalid email');
      }

      const isMatchPassword = await bcrypt.compare(
        dto.password,
        getUser.password
      );
      if (!isMatchPassword) {
        throw new UnauthorizedException('Invalid password');
      }

      const token = this.jwtService.sign({
        userId: getUser.id,
        email: getUser.email,
        username: getUser.username,
      });

      return UserMapper.toAuthResponse(token);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to login');
    }
  }

  // async create(data: Partial<Post>) {
  //   try {
  //     const postEntity = CreatePostMapper.toEntity(data);
  //     console.log(postEntity, 'postEntity');

  //     await this.postRepo.save(postEntity);
  //     const postDto = CreatePostMapper.toDto(postEntity);
  //     return postDto;
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException('Failed to create post');
  //   }
  // }

  // async findAll() {
  //   try {
  //     return await this.postRepo.find({ select: ['id', 'title', 'content'] });
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException('Failed to fetch posts');
  //   }
  // }

  // async findOne(id: number) {
  //   try {
  //     console.log('post service cal');

  //     const post = await this.postRepo.findOneBy({ id });
  //     if (!post) throw new NotFoundException('Post not found');
  //     return post;
  //   } catch (error) {
  //     if (error instanceof NotFoundException) throw error;
  //     throw new InternalServerErrorException('Failed to fetch post');
  //   }
  // }

  // async update(id: number, data: Partial<Post>) {
  //   try {
  //     const result = await this.postRepo.update(id, data);
  //     if (!result.affected) throw new NotFoundException('Post not found');

  //     const updated = await this.postRepo.findOneBy({ id });
  //     if (!updated) throw new NotFoundException('Post not found after update');

  //     return updated;
  //   } catch (error) {
  //     if (error instanceof NotFoundException) throw error;
  //     throw new InternalServerErrorException('Failed to update post');
  //   }
  // }

  // async remove(id: number) {
  //   try {
  //     const result = await this.postRepo.delete(id);
  //     if (!result.affected) throw new NotFoundException('Post not found');
  //     return { deleted: true };
  //   } catch (error) {
  //     if (error instanceof NotFoundException) throw error;
  //     throw new InternalServerErrorException('Failed to delete post');
  //   }
  // }
}
