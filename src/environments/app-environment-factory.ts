import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as process from 'process';

import { IAppEnvironment } from '../interfaces/app-environment.interface';
import AppDevelopmentEnvironment from './app-development.environment';
import AppProductionEnvironment from './app-production.environment';

export function createAppEnvironmentFactory(
  app: NestExpressApplication,
  configService: ConfigService,
): IAppEnvironment {
  switch (process.env.NODE_ENV) {
    case 'production':
      return new AppProductionEnvironment(app, configService);
    case 'development':
    default:
      return new AppDevelopmentEnvironment(app, configService);
  }
}
