import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { IBaseTokenService } from './base.token.service.interface';
import { Entity, Repository } from 'redis-om';
import { v4 as uuid } from 'uuid';
import { IBaseTokenPayload } from './base.token-payload.interface';
import { IAbstractTokens } from './base.abstract.tokens.interface';
import { BadRequestException } from '@nestjs/common';
import { ITokenAndUuid } from '../token-and-uuid.interface';

export abstract class BaseTokenService implements IBaseTokenService {
  abstract signOptions: JwtSignOptions;

  protected constructor(
    protected readonly jwtService: JwtService,
    protected readonly repository: Repository,
  ) {}

  async getEntityById(id: string): Promise<Entity> {
    return await this.repository.fetch(id);
  }

  getEntityData(entity: Entity): IAbstractTokens {
    return entity as unknown as IAbstractTokens;
  }

  async simpleSign(payload: any): Promise<ITokenAndUuid> {
    const tokenUuid = uuid();

    return {
      token: this.jwtService.sign(
        { ...payload, uuid: tokenUuid },
        this.signOptions,
      ),
      uuid: tokenUuid,
    };
  }

  async signAndPush(payload: any, id: string): Promise<string> {
    const { token, uuid } = await this.simpleSign(payload);
    const savedTokensUuidEntity = await this.getEntityById(id);
    const savedTokensUuidData = this.getEntityData(savedTokensUuidEntity);

    savedTokensUuidData.uuids.push(uuid);
    await this.repository.save(savedTokensUuidEntity);

    return token;
  }

  async signAndClear(payload: any, id: string): Promise<string> {
    const { token, uuid } = await this.simpleSign(payload);
    const savedTokensUuidEntity = await this.getEntityById(id);
    const savedTokensUuidData = this.getEntityData(savedTokensUuidEntity);

    savedTokensUuidData.uuids = [uuid];
    await this.repository.save(savedTokensUuidEntity);

    return token;
  }

  async decode(token: string): Promise<object> {
    try {
      return this.jwtService.decode(token);
    } catch (err) {
      throw new BadRequestException('Unable to decode token');
    }
  }

  async remove(token: string, id: string): Promise<boolean> {
    const savedTokensUuid = await this.getEntityById(id);
    const savedTokensUuidData = this.getEntityData(savedTokensUuid);
    const dataLenBeforeRemove = savedTokensUuidData.uuids.length;

    try {
      const payload: IBaseTokenPayload = (await this.decode(
        token,
      )) as IBaseTokenPayload;

      savedTokensUuidData.uuids = savedTokensUuidData.uuids.filter(
        (uuid) => uuid !== payload.uuid,
      );
      await this.repository.save(savedTokensUuid);

      return dataLenBeforeRemove !== savedTokensUuidData.uuids.length;
    } catch (err) {
      throw new BadRequestException('Invalid token');
    }
  }

  async clear(id: string): Promise<void> {
    await this.repository.remove(id);
  }

  async simpleVerify(token: string): Promise<IBaseTokenPayload> {
    try {
      return this.jwtService.verify(token, this.signOptions);
    } catch (err) {
      throw new BadRequestException('Invalid token');
    }
  }

  async verify(token: string, id: string): Promise<IBaseTokenPayload> {
    const savedTokensUuid = await this.getEntityById(id);
    const savedTokensUuidData = this.getEntityData(savedTokensUuid);

    try {
      const payload: IBaseTokenPayload = await this.simpleVerify(token);

      if (!savedTokensUuidData.uuids.includes(payload.uuid)) throw new Error();

      return payload;
    } catch (err) {
      throw new BadRequestException('Invalid token');
    }
  }

  async verifyAndClear(token: string, id: string): Promise<object> {
    const savedTokensUuid = await this.getEntityById(id);
    const savedTokensUuidData = this.getEntityData(savedTokensUuid);

    try {
      const payload: IBaseTokenPayload = await this.simpleVerify(token);

      if (!savedTokensUuidData.uuids.includes(payload.uuid)) throw new Error();

      savedTokensUuidData.uuids = [];
      await this.repository.save(savedTokensUuid);

      return payload;
    } catch (err) {
      throw new BadRequestException('Invalid token');
    }
  }

  async verifyAndRemove(token: string, id: string): Promise<object> {
    const savedTokensUuid = await this.getEntityById(id);
    const savedTokensUuidData = this.getEntityData(savedTokensUuid);

    try {
      const payload: IBaseTokenPayload = await this.simpleVerify(token);

      if (!savedTokensUuidData.uuids.includes(payload.uuid)) throw new Error();

      savedTokensUuidData.uuids = savedTokensUuidData.uuids.filter(
        (uuid) => uuid !== payload.uuid,
      );
      await this.repository.save(savedTokensUuid);

      return payload;
    } catch (err) {
      throw new BadRequestException('Invalid token');
    }
  }
}
