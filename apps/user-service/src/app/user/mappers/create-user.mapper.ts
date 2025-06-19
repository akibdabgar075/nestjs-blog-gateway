import { User } from '../entities/user.entity';
import { CreateUserDto } from '@workspace/dto';
import { CreateUserResponse } from '../interfaces/user-response.interface';

export class CreateUserMapper {
  static toEntity(dto: Partial<CreateUserDto>): User {
    const user = new User();
    user.username = dto.username?.trim();
    user.email = dto.email?.toLowerCase();
    user.bio = dto.bio;
    return user;
  }

  static toResponseDto(entity: User): CreateUserResponse {
    return {
      message: 'User created successfully.',
      data: {
        id: entity.id,
        username: entity.username,
        email: entity.email,
        bio: entity.bio,
      },
    };
  }
}
