import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { UserVerificationMail } from './mail-types/user-verification.mail';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { ConfigService } from '@nestjs/config';
import { TicketReceiptMail } from './mail-types/ticket-receipt.mail';
import { UserResetPswMail } from './mail-types/user-reset-psw.mail';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    TokenModule,
    SendGridModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        apikey: configService.get(`api.sendgrid.key`),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    MailerService,
    { provide: 'UserVerificationMail', useClass: UserVerificationMail },
    { provide: 'UserResetPswMail', useClass: UserResetPswMail },
    { provide: 'TicketReceiptMail', useClass: TicketReceiptMail },
  ],
  exports: [MailerService],
})
export class MailerModule {}
