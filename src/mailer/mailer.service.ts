import { Inject, Injectable } from '@nestjs/common';
import { UserVerificationMailDto } from './interfaces/dto/user-verification/user-verification.mail.dto';
import { IBaseMailType } from './interfaces/base.mail-type.interface';
import { TicketReceiptMailDto } from './interfaces/dto/ticket-receipt/ticket-receipt.mail.dto';

@Injectable()
export class MailerService {
  constructor(
    @Inject('UserVerificationMail')
    private readonly userVerificationMail: IBaseMailType,
    @Inject('UserResetPswMail')
    private readonly userResetPswMail: IBaseMailType,
    @Inject('TicketReceiptMail')
    private readonly ticketReceiptMail: IBaseMailType,
  ) {}

  async userEmailVerification(
    mailInfo: UserVerificationMailDto,
  ): Promise<void> {
    await this.userVerificationMail.execute(mailInfo);
  }

  async userResetPsw(mailInfo: UserVerificationMailDto): Promise<void> {
    await this.userResetPswMail.execute(mailInfo);
  }

  async ticketReceipt(mailInfo: TicketReceiptMailDto): Promise<void> {
    await this.ticketReceiptMail.execute(mailInfo);
  }
}
