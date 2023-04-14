import * as process from 'node:process';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import AppDevelopment from './environments/app-development';
import AppProduction from './environments/app-production';
import { handleAppListen } from './utils/app-listen-handler';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const HOST = configService.get<string>('app.host', '127.0.0.1');
  const PORT = configService.get<number>('app.port', 3001);

  switch (process.env.NODE_ENV) {
    case 'production':
      new AppProduction(app, configService).initialize();
      break;
    case 'development':
      new AppDevelopment(app, configService).initialize();
      break;
    default:
      new AppDevelopment(app, configService).initialize();
      break;
  }

  await app.listen(PORT, HOST);
  await handleAppListen(app);
}
bootstrap();
