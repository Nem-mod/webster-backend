import { Module } from '@nestjs/common';
import { UserVerifyTokensService } from './user/verify/user.verify.tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { UserRefreshTokensService } from './user/refresh/user.refresh.tokens.service';
import { UserResetPswTokensService } from './user/reset-psw/user.reset-psw.tokens.service';
import { UserAccessTokensService } from './user/access/user.access.tokens.service';
import { TicketScanTokensService } from './ticket/scan/ticket.scan.tokens.service';
import { NestRedisOmModule } from '../redis-om/nest.redis-om.module';
import { TicketScanTokensSchema } from './ticket/scan/ticket.scan.tokens.schema';
import { UserAccessTokensSchema } from './user/access/user.access.tokens.schema';
import { UserResetPswTokensSchema } from './user/reset-psw/user.reset-psw.tokens.schema';
import { UserRefreshTokensSchema } from './user/refresh/user.refresh.tokens.schema';
import { UserVerifyTokensSchema } from './user/verify/user.verify.tokens.schema';

@Module({
  imports: [
    JwtModule,
    NestRedisOmModule.forRoot(
      [
        UserVerifyTokensSchema,
        UserRefreshTokensSchema,
        UserResetPswTokensSchema,
        UserAccessTokensSchema,
        TicketScanTokensSchema,
      ],
      {
        url: 'redis://miconbeko:uQQB9fWx,8DALWK,&PrS@redis-19996.c311.eu-central-1-1.ec2.redns.redis-cloud.com:19996',
      },
    ),
  ],
  providers: [
    { provide: 'verifyService', useClass: UserVerifyTokensService },
    { provide: 'accessService', useClass: UserAccessTokensService },
    { provide: 'refreshService', useClass: UserRefreshTokensService },
    { provide: 'resetPswService', useClass: UserResetPswTokensService },
    { provide: 'scanService', useClass: TicketScanTokensService },
  ],
  exports: [
    { provide: 'verifyService', useClass: UserVerifyTokensService },
    { provide: 'accessService', useClass: UserAccessTokensService },
    { provide: 'refreshService', useClass: UserRefreshTokensService },
    { provide: 'resetPswService', useClass: UserResetPswTokensService },
    { provide: 'scanService', useClass: TicketScanTokensService },
  ],
})
export class TokenModule {}
