import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // app.useLogger(app.get(Logger));

  app.enableCors({
    credentials: true,
    origin: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
    }),
  );

  await app.listen(configService.get('http.port'));
}
bootstrap();
