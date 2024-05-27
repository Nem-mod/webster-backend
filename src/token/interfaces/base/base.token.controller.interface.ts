import { PayloadAndIdDto } from '../dto/payload-and-id.dto';
import { TokenAndIdDto } from '../dto/token-and-id.dto';

export interface IBaseTokenController {
  simpleSign(payload: any): Promise<string>;
  signAndPush(obj: PayloadAndIdDto): Promise<string>;
  signAndClear(obj: PayloadAndIdDto): Promise<string>;
  decode(token: string): Promise<object>;
  remove(obj: TokenAndIdDto): Promise<boolean>;
  simpleVerify(token: string): Promise<object>;
  verify(obj: TokenAndIdDto): Promise<object>;
  verifyAndClear(obj: TokenAndIdDto): Promise<object>;
  verifyAndRemove(obj: TokenAndIdDto): Promise<object>;
}
