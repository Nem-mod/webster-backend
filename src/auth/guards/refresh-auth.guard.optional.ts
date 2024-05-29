import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptionalRefreshJwtAuthGuard extends AuthGuard(`refreshCookies`) {
  handleRequest(err: any, user: any) {
    return user;
  }
}
