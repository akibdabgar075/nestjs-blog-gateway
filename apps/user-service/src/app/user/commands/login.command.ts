import { LoginInfo } from '../interfaces/login.interface';

export class LoginUserCommand {
  constructor(public readonly dto: LoginInfo) {}
}
