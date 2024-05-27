import { Injectable } from '@nestjs/common';
import { BaseMailTypeSendgrid } from '../interfaces/base.mail-type.sendgrid';
import { ConfigService } from '@nestjs/config';
import { SendGridService } from '@anchan828/nest-sendgrid';
import * as _ from 'lodash';
import { TicketReceiptMailDto } from '../interfaces/dto/ticket-receipt/ticket-receipt.mail.dto';
import { TicketReceiptPayloadDto } from '../interfaces/dto/ticket-receipt/ticket-receipt.payload.dto';
import { TicketReceiptTemplateDataDto } from '../interfaces/dto/ticket-receipt/ticket-receipt.template-data.dto';

@Injectable()
export class TicketReceiptMail extends BaseMailTypeSendgrid {
  protected emailTemplate: string;
  protected imgPrefix: string;

  constructor(
    protected readonly configService: ConfigService,
    protected readonly sendGridService: SendGridService,
  ) {
    super(configService, sendGridService);
    this.emailTemplate = this.configService.get(
      'api.sendgrid.templates.ticket-receipt',
    );
    this.imgPrefix = this.configService.get('api.qr.prefix');
  }

  async extractPayload(
    mailInfo: TicketReceiptMailDto,
  ): Promise<TicketReceiptPayloadDto> {
    return _.pick(
      mailInfo,
      Object.getOwnPropertyNames(new TicketReceiptPayloadDto()),
    ) as TicketReceiptPayloadDto;
  }

  async generateJwt(payload: TicketReceiptPayloadDto): Promise<string> {
    return payload.token;
  }

  setTemplateData(
    mailInfo: TicketReceiptMailDto,
  ): TicketReceiptTemplateDataDto {
    return {
      // imgLink: mailInfo.returnLink,
      imgLink: this.imgPrefix + mailInfo.returnLink,
      link: mailInfo.returnLink,
    };
  }

  async prepareReturnLink(
    payload: TicketReceiptPayloadDto,
    returnLink: string,
  ): Promise<string> {
    return await super.prepareReturnLink(payload, returnLink);
  }

  async sendMail(
    email: string,
    templateData: TicketReceiptTemplateDataDto,
  ): Promise<void> {
    await super.sendMail(email, templateData);
  }

  async execute(mailInfo: TicketReceiptMailDto): Promise<void> {
    await super.execute(mailInfo);
  }
}
