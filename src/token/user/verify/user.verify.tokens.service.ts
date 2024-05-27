import { Inject, Injectable } from '@nestjs/common';
import { BaseTokenService } from '../../interfaces/base/base.token.service';
import { IBaseTokenService } from '../../interfaces/base/base.token.service.interface';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Repository } from 'redis-om';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserVerifyTokensService
  extends BaseTokenService
  implements IBaseTokenService
{
  signOptions: JwtSignOptions;

  constructor(
    protected readonly jwtService: JwtService,
    @Inject('user:verify')
    protected readonly userVerifyTokenRepository: Repository,
    private readonly configService: ConfigService,
  ) {
    super(jwtService, userVerifyTokenRepository);
    this.signOptions = configService.get('jwt.verify');
  }
}
