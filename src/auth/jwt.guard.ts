import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './public.decorateur';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Token manquant');

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwt.verify(token);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
