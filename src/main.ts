import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { createAppEnvironmentFactory } from './environments/app-environment-factory';
import { handleAppListen } from './utils/app-listen-handler';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  createAppEnvironmentFactory(app, configService).initialize();

  const HOST = configService.get<string>('app.host', '127.0.0.1');
  const PORT = configService.get<number>('app.port', 3001);
  await app.listen(PORT, HOST);
  await handleAppListen(app);
}
bootstrap();
