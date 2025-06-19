import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from '../login.command';
import { UserService } from '../../user.service';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(private readonly userService: UserService) {}

  async execute(command: LoginUserCommand) {
    return this.userService.login(command.dto);
  }
}
