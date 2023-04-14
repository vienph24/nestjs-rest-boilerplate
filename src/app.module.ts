import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './apps/users/users.module';

import appConfig from './configs/app.config';
import corsConfig from './configs/cors.config';
import swaggerConfig from './configs/swagger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, swaggerConfig, corsConfig],
    }),
    UsersModule,
  ],
  providers: [],
})
export class AppModule {}
