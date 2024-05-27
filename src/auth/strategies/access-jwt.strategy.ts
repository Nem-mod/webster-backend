import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-cookie';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { FullUserDto } from '../../user/dto/full-user.dto';
import { BaseTokenService } from '../../token/interfaces/base/base.token.service';
import { IdDto } from '../../token/interfaces/dto/id.dto';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
  Strategy,
  `accessCookies`,
) {
  constructor(
    private readonly userService: UserService,
    @Inject('accessService')
    private readonly userAccessTokensService: BaseTokenService,
  ) {
    super({
      cookieName: 'accessToken',
    });
  }

  async validate(token: string): Promise<FullUserDto> {
    const payload: IdDto = (await this.userAccessTokensService.decode(
      token,
    )) as IdDto;

    await this.userAccessTokensService.verify(token, payload.id);

    return await this.userService.findById(payload.id);
  }
}
