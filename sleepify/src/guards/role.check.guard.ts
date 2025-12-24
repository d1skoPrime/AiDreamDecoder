import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleCheckGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate = async (context: ExecutionContext): Promise<boolean> => {
    const requireRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !requireRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  };
}
