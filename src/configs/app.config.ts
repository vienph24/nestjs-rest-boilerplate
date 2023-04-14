import * as process from 'node:process';

import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.HOST,
  port: process.env.PORT,
  name: process.env.NAME,
  apiVersion: process.env.API_VERSION,
  compression: process.env.COMPRESSION_THRESHOLD,
  logLevels: process.env.LOG_LEVELS,
}));
