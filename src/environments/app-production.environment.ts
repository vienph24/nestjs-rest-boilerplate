import * as process from 'node:process';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as basicAuth from 'express-basic-auth';
import helmet from 'helmet';

import AppDevelopmentEnvironment from './app-development.environment';

export default class AppProductionEnvironment extends AppDevelopmentEnvironment {
  private readonly basicAuthOptions: any;
  private readonly SWAGGER_USERNAME: string;
  private readonly SWAGGER_PASSWORD: string;
  constructor(app: NestExpressApplication, configService: ConfigService) {
    super(app, configService);
    this.logger = new Logger(AppProductionEnvironment.name);
    this.SWAGGER_USERNAME = this.configService.get<string>(
      'swagger.username',
      'administrator',
    );
    this.SWAGGER_PASSWORD = this.configService.get<string>(
      'swagger.password',
      'admin@123',
    );
    /**
     * Basic authentication used for the Swagger
     */
    this.basicAuthOptions = {
      challenge: true,
      users: {
        [this.SWAGGER_USERNAME]: this.SWAGGER_PASSWORD,
      },
    };
    /**
     * CORS configurations
     */
    this.corsOptions.origin = this.configService.get<string>(
      'cors.frontendBaseUrl',
    );
    this.corsOptions.credentials = true;

    /**
     * Logger level configurations
     */
    // Remove the debug level
    this.LOG_LEVELS.pop();
  }

  initialize() {
    super.enableGlobalPipes();
    super.enableGlobalPrefix();
    super.setLogLevel();
    super.enableCompression();
    super.enableCors();

    this.enableSwaggerBasicAuth();
    this.setupDocument();
    this.handleUncaughtException();
    this.enableHelmet();
    this.logger.warn(
      '⚠️ Initialized production environment. Please check your production configurations again!',
    );
  }

  enableSwaggerBasicAuth(): void {
    this.app.use([this.documentOptions.path], basicAuth(this.basicAuthOptions));
  }

  handleUncaughtException(): void {
    process.on('uncaughtException', () => {
      this.logger.warn('Process finished with uncaughtException');
      process.exit();
    });
  }

  enableHelmet(): void {
    this.app.use(helmet());
  }
}
