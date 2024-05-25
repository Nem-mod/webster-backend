import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response as ResponseType } from 'express';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { httponlyCookieOptions } from '../config/httponlyCookieOptions';
import { CredentialsDto } from './dto/credentials.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { FullUserDto } from '../user/dto/full-user.dto';
import { VerifyPayloadDto } from './dto/verify-payload.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { SendLinkDto } from '../mailer/dto/send-link.dto';
import { LoginDto } from './dto/login.dto';
import { MailerService } from '../mailer/mailer.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  private expiredRefreshTokens: Set<string> = new Set();

  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
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

  async validateRefresh(tokens: CredentialsDto): Promise<CredentialsDto> {
    if (this.expiredRefreshTokens.has(tokens.refreshToken))
      throw new UnauthorizedException(`Refresh token has expired`);
    return tokens;
  }

  async register(user: CreateUserDto): Promise<FullUserDto> {
    const newUser: FullUserDto = await this.userService.create(user);

    this.eventEmitter.emit(`user.created`, newUser._id);

    return newUser;
  }

  async sendVerifyEmail(linkInfo: SendLinkDto): Promise<void> {
    const user: FullUserDto = await this.userService.findByEmail(
      linkInfo.email,
    );
    if (user.verified) throw new ForbiddenException(`User already verified`);

    linkInfo.returnUrl = await this.mailerService.prepareLink(
      { username: user.username, sub: user._id } as VerifyPayloadDto,
      linkInfo,
      this.configService.get(`jwt.verify`),
      `verifyToken`,
    );

    await this.mailerService.sendEmail(
      user.email,
      this.configService.get(`api.sendgrid.verify-template`),
      { link: linkInfo.returnUrl },
    );
  }

  async validateVerifyEmail(token: string): Promise<void> {
    const payload: VerifyPayloadDto =
      await this.mailerService.validateTokenFromEmail(
        token,
        this.configService.get(`jwt.verify`),
      );

    await this.userService.verify(payload.sub);
  }

  async login(user: FullUserDto): Promise<CredentialsDto> {
    const payload: VerifyPayloadDto = {
      username: user.username,
      sub: user._id,
    };

    const accessToken = this.jwtService.sign(
      payload,
      this.configService.get(`jwt.access`),
    );
    const refreshToken = this.jwtService.sign(
      payload,
      this.configService.get(`jwt.refresh`),
    );

    return { accessToken, refreshToken };
  }

  async logout(tokens: CredentialsDto): Promise<void> {
    this.expiredRefreshTokens.add(tokens.refreshToken);
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

  async findUserById(userId: string): Promise<FullUserDto> {
    return await this.userService.findById(userId);
  }

  async editProfile(
    currentUser: FullUserDto,
    user: UpdateUserDto,
  ): Promise<FullUserDto> {
    return this.userService.update(currentUser._id, user);
  }

  async deleteProfile(userId: string): Promise<void> {
    await this.userService.remove(userId);
    this.eventEmitter.emit(`user.deleted`, userId);
  }
}
