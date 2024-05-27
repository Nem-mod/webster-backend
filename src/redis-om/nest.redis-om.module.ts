import { DynamicModule, Module } from '@nestjs/common';
import { createClient, RedisClientOptions } from 'redis';
import { Schema, Repository } from 'redis-om';

@Module({})
export class NestRedisOmModule {
  static async forRoot(
    schemas: Schema[],
    options: RedisClientOptions,
  ): Promise<DynamicModule> {
    const redis = createClient(options);
    await redis.connect();
    const repositories = schemas.map((schema) => {
      return {
        provide: schema.schemaName,
        useValue: new Repository(schema, redis),
      };
    });

    return {
      module: NestRedisOmModule,
      providers: repositories,
      exports: repositories,
    };
  }

  // static forRootAsync(
  //   options: NestjsRedisOmModuleAsyncOptions,
  // ): DynamicModule {
  //   const redisProvider: Provider = {
  //     inject: [NEST_REDISOM_MODULE_OPTIONS],
  //     provide: NEST_REDISOM_TOKEN,
  //     useFactory: async (options: RedisClientOptions) => new NestRedisOmService(options)
  //   }
  // }
}

// public static forRootAsync(
//   options: HttpClientModuleAsyncOptions
// ): DynamicModule {
//   const provider: Provider = {
//     inject: [HTTP_CLIENT_MODULE_OPTIONS],
//     provide: HTTP_CLIENT_TOKEN,
//     useFactory: async (options: HttpClientModuleOptions) =>
//       getHttpClientModuleOptions(options),
//   };
//
//   return {
//     module: HttpClientModule,
//     imports: options.imports,
//     providers: [{
//       provide: HTTP_CLIENT_MODULE_OPTIONS,
//       useFactory: options.useFactory,
//       inject: options.inject || [],
//     }, provider],
//     exports: [provider],
//   };
// }
