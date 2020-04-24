// It is crucial that the following global variables are set BEFORE anything
// else is imported!
// Normally it would not matter to the TypeScript compiler but node-ts and
// Webpack are having difficulties when globals are not defined first.
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiDDBModule } from './api.ddb.module';

async function bootstrap(): Promise<void> {
  const port = 4000;

  const app = await NestFactory.create(ApiDDBModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');
  await app.listen(port);
}
bootstrap();
