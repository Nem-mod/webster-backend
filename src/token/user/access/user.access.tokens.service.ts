import { Inject, Injectable } from '@nestjs/common';
import { BaseTokenService } from '../../interfaces/base/base.token.service';
import { IBaseTokenService } from '../../interfaces/base/base.token.service.interface';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Repository } from 'redis-om';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserAccessTokensService
  extends BaseTokenService
  implements IBaseTokenService
{
  signOptions: JwtSignOptions;

  constructor(
    protected readonly jwtService: JwtService,
    @Inject('user:access')
    protected readonly userAccessTokenRepository: Repository,
    private readonly configService: ConfigService,
  ) {
    super(jwtService, userAccessTokenRepository);
    this.signOptions = configService.get('jwt.access');
  }
}
