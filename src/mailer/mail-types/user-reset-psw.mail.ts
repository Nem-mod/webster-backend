import { BaseMailTypeSendgrid } from '../interfaces/base.mail-type.sendgrid';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendGridService } from '@anchan828/nest-sendgrid';
import * as _ from 'lodash';
import { UserResetPswPayloadDto } from '../interfaces/dto/user-reset-psw/user-reset-psw.payload.dto';
import { UserResetPswMailDto } from '../interfaces/dto/user-reset-psw/user-reset-psw.mail.dto';
import { UserResetPswTemplateDataDto } from '../interfaces/dto/user-reset-psw/user-reset-psw.template-data.dto';
import { BaseTokenService } from '../../token/interfaces/base/base.token.service';

@Injectable()
export class UserResetPswMail extends BaseMailTypeSendgrid {
  protected emailTemplate: string;

  constructor(
    protected readonly configService: ConfigService,
    protected readonly sendGridService: SendGridService,
    @Inject('resetPswService')
    private readonly userResetPswTokensService: BaseTokenService,
  ) {
    super(configService, sendGridService);
    this.emailTemplate = this.configService.get(
      'api.sendgrid.templates.user-reset-psw',
    );
  }

  async extractPayload(
    mailInfo: UserResetPswMailDto,
  ): Promise<UserResetPswPayloadDto> {
    return _.pick(
      mailInfo,
      Object.getOwnPropertyNames(new UserResetPswPayloadDto()),
    ) as UserResetPswPayloadDto;
  }

  async generateJwt(payload: UserResetPswPayloadDto): Promise<string> {
    return await this.userResetPswTokensService.signAndClear(
      payload,
      payload.id,
    );
  }

  setTemplateData(mailInfo: UserResetPswMailDto): UserResetPswTemplateDataDto {
    return {
      link: mailInfo.returnLink,
    };
  }

  async prepareReturnLink(
    payload: UserResetPswPayloadDto,
    returnLink: string,
  ): Promise<string> {
    return await super.prepareReturnLink(payload, returnLink);
  }

  async sendMail(
    email: string,
    templateData: UserResetPswTemplateDataDto,
  ): Promise<void> {
    await super.sendMail(email, templateData);
  }

  async execute(mailInfo: UserResetPswMailDto): Promise<void> {
    await super.execute(mailInfo);
  }
}
