import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtConfigModule } from '@workspace/Jwt-Module';

@Module({
  imports: [JwtConfigModule],
  controllers: [UserController],
  providers: [JwtAuthGuard],
})
export class AuthModule {}
