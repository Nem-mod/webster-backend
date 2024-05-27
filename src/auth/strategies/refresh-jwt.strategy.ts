import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { FullUserDto } from '../../user/dto/full-user.dto';
import { Strategy } from 'passport-cookie';
import { BaseTokenService } from '../../token/interfaces/base/base.token.service';
import { IdDto } from '../../token/interfaces/dto/id.dto';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  `refreshCookies`,
) {
  constructor(
    private readonly userService: UserService,
    @Inject('refreshService')
    private readonly userRefreshTokensService: BaseTokenService,
  ) {
    super({
      cookieName: 'refreshToken',
    });
  }

  async validate(token: string): Promise<FullUserDto> {
    const payload: IdDto = (await this.userRefreshTokensService.decode(
      token,
    )) as IdDto;

    await this.userRefreshTokensService.verify(token, payload.id);

    return await this.userService.findById(payload.id);
  }
}
