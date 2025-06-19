import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { UserService } from './user.service';
import { LoginUserHandler } from './commands/handlers/login.handler';
import { JwtConfigModule } from '@workspace/Jwt-Module';

const CommandHandlers = [CreateUserHandler, LoginUserHandler];
const QueryHandlers = [];

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule, JwtConfigModule],
  controllers: [UserController],
  providers: [UserService, ...CommandHandlers, ...QueryHandlers],
  exports: [UserService],
})
export class UserModule {}
