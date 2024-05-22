import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtVerifyTokenGuard extends AuthGuard('jwt-verify-email') {
  constructor(private reflector: Reflector) {
    super();
  }
}
