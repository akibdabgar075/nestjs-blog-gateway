import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserInfo } from './interfaces/create-user.interface';
import { CreateUserCommand } from './commands/create-user.command';
import { LoginInfo } from './interfaces/login.interface';
import { LoginUserCommand } from './commands/login.command';
// import { GetAllUsersQuery } from './queries/get-all-users.query';
// import { GetUserQuery } from './queries/get-user.query';

@Controller()
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @MessagePattern('create_user')
  async createUser(@Payload() data: CreateUserInfo) {
    return this.commandBus.execute(new CreateUserCommand(data));
  }

  @MessagePattern('login_user')
  login(@Payload() dto: LoginInfo) {
    return this.commandBus.execute(new LoginUserCommand(dto));
  }

  // @MessagePattern('get_user')
  // async getUser(@Payload() id: number) {
  //   return this.queryBus.execute(new GetUserQuery(id));
  // }

  // @MessagePattern('get_all_users')
  // async getAllUsers() {
  //   return this.queryBus.execute(new GetAllUsersQuery());
  // }
}
