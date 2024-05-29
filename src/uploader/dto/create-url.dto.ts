import { IsNotEmpty } from 'class-validator';
import { IsImageUrl } from '../decorators/isImageUrl.validator';

export class CreateUrlDto {
  @IsNotEmpty()
  @IsImageUrl()
  url: string;
}
