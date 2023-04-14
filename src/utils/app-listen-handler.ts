import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

export async function handleAppListen(
  app: NestExpressApplication,
): Promise<void> {
  Logger.log(`App serving at 🚀 ${await app.getUrl()}`);
}
