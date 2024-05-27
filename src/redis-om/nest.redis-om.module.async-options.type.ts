import { RedisClientOptions } from 'redis';
import { Schema } from 'redis-om';

export type NestjsRedisOmModuleAsyncOptions = {
  schemas: Schema[];
  // imports: any[];
  inject: any[];
  useFactory: (
    ...args: any[]
  ) => Promise<RedisClientOptions> | RedisClientOptions;
};
