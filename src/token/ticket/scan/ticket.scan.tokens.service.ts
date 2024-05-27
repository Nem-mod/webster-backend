import { Inject, Injectable } from '@nestjs/common';
import { BaseTokenService } from '../../interfaces/base/base.token.service';
import { IBaseTokenService } from '../../interfaces/base/base.token.service.interface';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Repository } from 'redis-om';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TicketScanTokensService
  extends BaseTokenService
  implements IBaseTokenService
{
  signOptions: JwtSignOptions;

  constructor(
    protected readonly jwtService: JwtService,
    @Inject('ticket:scan')
    protected readonly ticketScanTokenRepository: Repository,
    private readonly configService: ConfigService,
  ) {
    super(jwtService, ticketScanTokenRepository);
    this.signOptions = configService.get('jwt.scan');
  }
}
