import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';

import { JwtService } from '@nestjs/jwt';
// import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    console.log('Headers:', request.headers);
    const authHeader = request.headers['authorization'];
    console.log(authHeader, 'authHeader');

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const [, token] = authHeader.split(' ');
    if (!token) {
      throw new UnauthorizedException('No token found');
    }
    console.log(token, 'token');
    try {
      const payload = this.jwtService.verify(token);
      request['user'] = payload; // attach decoded payload to request
      console.log(request['user'], 'user');
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
