import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

export class JwtResetPasswordTokenGuard extends AuthGuard(
  'jwt-reset-password',
) {
  constructor(private reflector: Reflector) {
    super();
  }
}
