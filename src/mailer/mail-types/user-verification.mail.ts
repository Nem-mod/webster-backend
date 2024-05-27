import { BaseMailTypeSendgrid } from '../interfaces/base.mail-type.sendgrid';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { UserVerificationPayloadDto } from '../interfaces/dto/user-verification/user-verification.payload.dto';
import { UserVerificationMailDto } from '../interfaces/dto/user-verification/user-verification.mail.dto';
import { UserVerificationTemplateDataDto } from '../interfaces/dto/user-verification/user-verification.template-data.dto';
import * as _ from 'lodash';
import { BaseTokenService } from '../../token/interfaces/base/base.token.service';

@Injectable()
export class UserVerificationMail extends BaseMailTypeSendgrid {
  protected emailTemplate: string;

  constructor(
    protected readonly configService: ConfigService,
    protected readonly sendGridService: SendGridService,
    @Inject('verifyService')
    private readonly userVerifyTokenService: BaseTokenService,
  ) {
    super(configService, sendGridService);
    this.emailTemplate = this.configService.get(
      'api.sendgrid.templates.user-verify',
    );
  }

  async extractPayload(
    mailInfo: UserVerificationMailDto,
  ): Promise<UserVerificationPayloadDto> {
    return _.pick(
      mailInfo,
      Object.getOwnPropertyNames(new UserVerificationPayloadDto()),
    ) as UserVerificationPayloadDto;
  }

  async generateJwt(payload: UserVerificationPayloadDto): Promise<string> {
    return await this.userVerifyTokenService.signAndClear(payload, payload.id);
  }

  setTemplateData(
    mailInfo: UserVerificationMailDto,
  ): UserVerificationTemplateDataDto {
    return {
      link: mailInfo.returnLink,
    };
  }

  async prepareReturnLink(
    payload: UserVerificationPayloadDto,
    returnLink: string,
  ): Promise<string> {
    return await super.prepareReturnLink(payload, returnLink);
  }

  async sendMail(
    email: string,
    templateData: UserVerificationTemplateDataDto,
  ): Promise<void> {
    await super.sendMail(email, templateData);
  }

  async execute(mailInfo: UserVerificationMailDto): Promise<void> {
    await super.execute(mailInfo);
  }
}
