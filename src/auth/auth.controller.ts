import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Response,
  HttpCode,
  Body,
  Delete,
  Patch,
  Query,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { Request as RequestType, Response as ResponseType } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AccessAuthGuard } from './guards/access-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { FullUserDto } from '../user/dto/full-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { CredentialsDto } from './dto/credentials.dto';
import { ReqUser } from './decorators/user.decorator';
import { BaseMailDto } from '../mailer/interfaces/dto/base.mail.dto';
import { plainToInstance } from 'class-transformer';
import { CreatePasswordDto } from '../user/dto/create-password.dto';

@Controller({
  path: `auth`,
  version: `1`,
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post(`register`)
  async register(@Body() user: CreateUserDto): Promise<FullUserDto> {
    const newUser: FullUserDto = await this.authService.register(user);

    return plainToInstance(FullUserDto, newUser);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(`verify/send`)
  async sendVerify(@Body() linkInfo: BaseMailDto) {
    await this.authService.sendVerifyEmail(linkInfo);
  }

  @Post(`verify/validate`)
  async validateVerify(@Query(`token`) token: string) {
    await this.authService.validateVerifyEmail(token);
  }

  @Get(`verify/validate`)
  async validateVerifyFromGet(@Query(`token`) token: string) {
    if (this.configService.get(`stage`) !== `develop`)
      throw new ForbiddenException(
        `This endpoint with GET method is only for development. Use PATCH`,
      );

    await this.authService.validateVerifyEmail(token);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(`resetpsw/send`)
  async sendResetPsw(@Body() linkInfo: BaseMailDto) {
    await this.authService.sendResetPswEmail(linkInfo);
  }

  @Post(`resetpsw/validate`)
  async validateResetPsw(
    @Query(`token`) token: string,
    @Body() newPassword: CreatePasswordDto,
  ): Promise<void> {
    await this.authService.validateResetPsw(token, newPassword.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post(`login`)
  async login(
    @Request() req: RequestType,
    @ReqUser() user: FullUserDto,
    @Response({ passthrough: true }) res: ResponseType,
  ): Promise<FullUserDto> {
    const tokens = await this.authService.login(user._id);

    await this.authService.logout(req.cookies);
    await this.authService.setAuthCookies(res, tokens);

    return plainToInstance(FullUserDto, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(`logout`)
  async logout(
    @Request() req: RequestType,
    @Response({ passthrough: true }) res: ResponseType,
  ): Promise<void> {
    await this.authService.logout(req.cookies);
    await this.authService.deleteAuthCookie(res);
  }

  @UseGuards(AccessAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(`logout/all`)
  async fullLogout(
    @Request() req: RequestType,
    @Response({ passthrough: true }) res: ResponseType,
  ): Promise<void> {
    await this.authService.fullLogout(req.user._id);
    await this.authService.deleteAuthCookie(res);
  }

  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(`refresh`)
  async refreshTokens(
    @Request() req: RequestType,
    @Response({ passthrough: true }) res: ResponseType,
  ) {
    await this.authService.logout(req.cookies);
    const tokens: CredentialsDto = await this.authService.login(req.user._id);
    await this.authService.setAuthCookies(res, tokens);
  }

  @UseGuards(AccessAuthGuard)
  @Get(`profile`)
  async getProfile(@ReqUser() user: FullUserDto): Promise<FullUserDto> {
    return plainToInstance(FullUserDto, user);
  }

  @UseGuards(AccessAuthGuard)
  @Patch(`profile`)
  async editUser(
    @ReqUser() currentUser: FullUserDto,
    @Body() user: UpdateUserDto,
  ): Promise<FullUserDto> {
    const updatedUser: FullUserDto = await this.authService.editProfile(
      currentUser._id,
      user,
    );

    return plainToInstance(FullUserDto, updatedUser);
  }

  @UseGuards(AccessAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(`profile`)
  async deleteProfile(
    @Request() req: RequestType,
    @Response({ passthrough: true }) res: ResponseType,
  ): Promise<void> {
    await this.authService.fullLogout(req.user._id);
    await this.authService.deleteAuthCookie(res);
    await this.authService.deleteProfile(req.user._id);
  }
}
