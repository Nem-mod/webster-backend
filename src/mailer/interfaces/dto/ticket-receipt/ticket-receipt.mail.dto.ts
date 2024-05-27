import { BaseMailDto } from '../base.mail.dto';
import { IntersectionType } from '@nestjs/swagger';
import { TicketReceiptPayloadDto } from './ticket-receipt.payload.dto';

export class TicketReceiptMailDto extends IntersectionType(
  BaseMailDto,
  TicketReceiptPayloadDto,
) {}
