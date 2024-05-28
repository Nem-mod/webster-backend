import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Response as ResponseType } from 'express';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { httponlyCookieOptions } from '../config/httponlyCookieOptions';
import { CredentialsDto } from './dto/credentials.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { FullUserDto } from '../user/dto/full-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { MailerService } from '../mailer/mailer.service';
import { BaseMailDto } from '../mailer/interfaces/dto/base.mail.dto';
import { UserVerificationMailDto } from '../mailer/interfaces/dto/user-verification/user-verification.mail.dto';
import { BaseTokenService } from '../token/interfaces/base/base.token.service';
import { IdDto } from '../token/interfaces/dto/id.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    @Inject('verifyService')
    private readonly userVerifyTokensService: BaseTokenService,
    @Inject('accessService')
    private readonly userAccessTokensService: BaseTokenService,
    @Inject('refreshService')
    private readonly userRefreshTokensService: BaseTokenService,
    @Inject('resetPswService')
    private readonly userResetPswTokensService: BaseTokenService,
  ) {}

  async validateUser(login: LoginDto): Promise<FullUserDto> {
    try {
      let user: FullUserDto;
      try {
        user = await this.userService.findByUsername(login.login);
      } catch (err) {
        user = await this.userService.findByEmail(login.login);
      }

      if (await bcrypt.compareSync(login.password, user.password)) {
        // const { password, ...result } = user;
        return user;
      }
    } catch (err) {}
    throw new UnauthorizedException();
  }

  async register(user: CreateUserDto): Promise<FullUserDto> {
    return await this.userService.create(user);
  }

  async sendVerifyEmail(linkInfo: BaseMailDto): Promise<void> {
    const user: FullUserDto = await this.userService.findByEmail(
      linkInfo.email,
    );
    if (user.verified) throw new ForbiddenException(`User already verified`);

    const mailInfo: UserVerificationMailDto = {
      ...linkInfo,
      id: user._id,
    };

    await this.mailerService.userEmailVerification(mailInfo);
  }

  async validateVerifyEmail(token: string): Promise<void> {
    const payload: IdDto = (await this.userVerifyTokensService.decode(
      token,
    )) as IdDto;
    await this.userVerifyTokensService.verifyAndClear(token, payload.id);

    await this.userService.verify(payload.id);
  }

  async sendResetPswEmail(linkInfo: BaseMailDto): Promise<void> {
    const user: FullUserDto = await this.userService.findByEmail(
      linkInfo.email,
    );

    const mailInfo: UserVerificationMailDto = {
      ...linkInfo,
      id: user._id,
    };

    await this.mailerService.userResetPsw(mailInfo);
  }

  async validateResetPsw(token: string, newPassword: string): Promise<void> {
    const payload: IdDto = (await this.userResetPswTokensService.decode(
      token,
    )) as IdDto;
    await this.userResetPswTokensService.verifyAndClear(token, payload.id);

    await this.userService.updatePassword(payload.id, newPassword);

    await this.fullLogout(payload.id);
  }

  async login(id: string): Promise<CredentialsDto> {
    const payload: IdDto = {
      id,
    };

    const accessToken: string = await this.userAccessTokensService.signAndPush(
      payload,
      payload.id,
    );
    const refreshToken: string =
      await this.userRefreshTokensService.signAndPush(payload, payload.id);

    return { accessToken, refreshToken };
  }

  async logout(tokens: CredentialsDto): Promise<void> {
    const payload: IdDto = (await this.userVerifyTokensService.decode(
      tokens.accessToken,
    )) as IdDto;

    if (!payload) return;

    await this.userAccessTokensService.remove(tokens.accessToken, payload.id);
    await this.userRefreshTokensService.remove(tokens.refreshToken, payload.id);
  }

  async fullLogout(id: string): Promise<void> {
    await this.userAccessTokensService.clear(id);
    await this.userRefreshTokensService.clear(id);
  }

  async setAuthCookies(
    res: ResponseType,
    tokens: CredentialsDto,
  ): Promise<void> {
    res.cookie(`accessToken`, tokens.accessToken, httponlyCookieOptions);
    res.cookie(`refreshToken`, tokens.refreshToken, httponlyCookieOptions);
  }

  async deleteAuthCookie(res: ResponseType): Promise<void> {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
  }

  async editProfile(id: string, user: UpdateUserDto): Promise<FullUserDto> {
    return this.userService.update(id, user);
  }

  async deleteProfile(id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
