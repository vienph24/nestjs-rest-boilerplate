import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import { json, Request, Response, urlencoded } from 'express';

import { IAppEnvironment } from '../interfaces/app-environment.interface';

export default class AppDevelopment implements IAppEnvironment {
  protected logger = new Logger(AppDevelopment.name);
  readonly corsOptions: CorsOptions;
  readonly compressionOptions: any;
  readonly documentOptions: any;
  readonly documentBuilder: DocumentBuilder;
  readonly API_VERSION: string;
  readonly APP_NAME: string;
  readonly SWAGGER_PATH: string;
  protected LOG_LEVELS: LogLevel[];

  readonly app: NestExpressApplication;
  readonly configService: ConfigService;

  constructor(app: NestExpressApplication, configService: ConfigService) {
    this.app = app;
    this.configService = configService;
    this.APP_NAME = this.configService.get<string>(
      'app.name',
      'admin-control-panel',
    );
    this.API_VERSION = this.configService.get<string>('app.apiVersion', 'v1');
    this.SWAGGER_PATH = this.configService.get<string>('swagger.path', 'specs');
    this.LOG_LEVELS = ['error', 'log', 'verbose', 'warn', 'debug'];

    /**
     * CORS configurations
     */
    this.corsOptions = {
      origin: '*',
      credentials: false,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-no-compression'],
    };

    /**
     * Compression configurations
     */
    this.compressionOptions = {
      threshold: this.configService.get<number>('app.compression', 100),
      filter: (req: Request, res: Response) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
      },
    };

    /**
     * Swagger configurations
     */
    this.documentOptions = {
      path: `/${this.API_VERSION}/${this.SWAGGER_PATH}`,
      swaggerOptions: {
        operationIdFactory: (methodKey: string) => methodKey,
      },
      setup: {
        explorer: true,
        customSiteTitle: 'Admin Control Panel API - TrustPayID',
      },
    };
    this.documentBuilder = new DocumentBuilder()
      .setTitle('Admin Control Panel API')
      .setDescription('Admin Control Panel API - TrustPayID')
      .setVersion(this.API_VERSION);
  }
  initialize(): void {
    this.enableGlobalPipes();
    this.enableGlobalPrefix();
    this.setLogLevel();
    this.setRequestSizeLimit();
    this.enableCompression();
    this.enableCors();
    this.setupDocument();
    this.logger.verbose('Initialized application development environment');
  }

  setRequestSizeLimit(): void {
    this.app.use(urlencoded({ extended: true, limit: '10kb' }));
    this.app.use(json({ limit: '10kb' }));
  }

  enableCompression(): void {
    this.app.use(compression(this.compressionOptions));
    this.logger.debug('Enabled compression');
  }

  enableCors(): void {
    this.app.enableCors(this.corsOptions);
    this.logger.debug('Enabled CORS');
  }

  enableGlobalPipes(): void {
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
  }

  enableGlobalPrefix(): void {
    this.app.setGlobalPrefix(this.API_VERSION);
  }

  setupDocument(): void {
    const document = SwaggerModule.createDocument(
      this.app,
      this.documentBuilder.build(),
      this.documentOptions.documentOptions,
    );

    SwaggerModule.setup(
      this.documentOptions.path,
      this.app,
      document,
      this.documentOptions.setup,
    );

    this.logger.log(`API Documentation {${this.documentOptions.path}, GET}`);
  }

  setLogLevel(): void {
    this.app.useLogger(this.LOG_LEVELS);
  }
}
