import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';
import { UserService } from '../users/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['auth_token'];

    if (!token) {
      throw new UnauthorizedException('No authentication token found');
    }

    const userFromSession = await this.userService.validateSession(token);
    if (!userFromSession) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const userFromDb = await this.userService.findOne(userFromSession.id);
    if (!userFromDb || !userFromDb.is_active) {
      throw new UnauthorizedException('User not found or inactive');
    }

    this.validateTokenConsistency(userFromSession, userFromDb);

    request['user'] = userFromDb;
    return true;
  }

  private validateTokenConsistency(sessionUser: any, dbUser: any) {
    const criticalFields = ['username', 'role'];
    for (const field of criticalFields) {
      if (sessionUser[field] !== dbUser[field]) {
        throw new UnauthorizedException(`Token data mismatch for ${field}`);
      }
    }
  }
}