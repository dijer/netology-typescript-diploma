import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import * as rolesMap from 'src/conts/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) {
      if (roles.includes(rolesMap.ANONYMOUS)) {
        return true;
      }
      return false;
    }
    if (roles.includes(rolesMap.REGISTERED)) {
      return true;
    }
    const token = authorization.replace(/Bearer /, '');
    const payload: any = jwt.verify(token, process.env.JWT_SECRET);
    const { role } = payload;
    if (!roles.includes(role)) {
      throw new ForbiddenException();
    }
    request.user = payload;
    return true;
  }
}
