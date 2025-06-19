import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto } from '@workspace/dto';

@ApiTags('Auth')
@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
  ) {}

  @Post('register')
  createUser(@Body() createPostDto: CreateUserDto) {
    return this.userClient.send('create_user', createPostDto);
  }

  @Post('login')
  loginUser(@Body() loginDto: LoginUserDto) {
    return this.userClient.send('login_user', loginDto);
  }
}
