import { IntersectionType } from '@nestjs/swagger';
import { TokenDto } from './token.dto';
import { IdDto } from './id.dto';

export class TokenAndIdDto extends IntersectionType(TokenDto, IdDto) {}
