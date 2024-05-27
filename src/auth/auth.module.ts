import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { TokenModule } from '../token/token.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MailerModule,
    TokenModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    AccessJwtStrategy,
    RefreshJwtStrategy,
    TokenModule,
  ],
  controllers: [AuthController],
  exports: [UserModule, AuthService],
})
export class AuthModule {}
