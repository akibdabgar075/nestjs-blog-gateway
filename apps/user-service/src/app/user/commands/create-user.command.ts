import { CreateUserInfo } from '../interfaces/create-user.interface';

export class CreateUserCommand {
  constructor(public readonly data: CreateUserInfo) {}
}
