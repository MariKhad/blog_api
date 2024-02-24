import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ERRORS } from '../../../const';
import * as jwt from 'jsonwebtoken';

export const IS_PUBLIC_KEY = 'isPublic'; // чтобы не было свободных строк :)

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization;

    if (!token) {
      throw new UnauthorizedException();
    }

    const decodedToken: any = jwt.decode(token.replace('Bearer ', ''));

    if (decodedToken && decodedToken.exp) {
      const currentTime = Date.now() / 1000;
      if (currentTime > decodedToken.exp) {
        throw new UnauthorizedException(ERRORS.TOKEN_EXPIRED);
      }
    }
    return super.canActivate(context);
  }
}
