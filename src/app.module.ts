import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './configs/app.config';
import corsConfig from './configs/cors.config';
import swaggerConfig from './configs/swagger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, swaggerConfig, corsConfig],
    }),
  ],
  providers: [],
})
export class AppModule {}
