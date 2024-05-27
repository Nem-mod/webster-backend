import { IsObject } from 'class-validator';
import { IdDto } from './id.dto';

export class PayloadAndIdDto extends IdDto {
  @IsObject()
  payload: object;
}
