import { IsNotEmpty, IsString } from 'class-validator';

export class TicketReceiptPayloadDto {
  @IsString()
  @IsNotEmpty()
  token: string = '';
}
