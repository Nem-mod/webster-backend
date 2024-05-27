import { ITokenAndUuid } from '../token-and-uuid.interface';

export interface IBaseTokenService {
  // verify(token: string): Promise<boolean>;
  //
  // getByEntityId(entityId: string): Promise<any>
  // aggregateEntityId(id: number): string
  //
  // push(entityId: string, uuid: string)
  // clear(entityId: string)
  // remove(uuid: string)
  //
  simpleSign(payload: any): Promise<ITokenAndUuid>;
  signAndPush(payload: any, id: string): Promise<string>;
  signAndClear(payload: any, id: string): Promise<string>;
  // signAndRemove(payload: any, id: string): Promise<string>;

  decode(token: string): Promise<object>;
  remove(token: string, id: string): Promise<boolean>;
  clear(id: string): Promise<void>;

  simpleVerify(token: string): Promise<object>;
  verify(token: string, id: string): Promise<object>;
  verifyAndClear(token: string, id: string): Promise<object>;
  verifyAndRemove(token: string, id: string): Promise<object>;
}
