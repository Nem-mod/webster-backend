import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptionalAccessJwtAuthGuard extends AuthGuard(`accessCookies`) {
  handleRequest(err: any, user: any) {
    return user;
  }
}
