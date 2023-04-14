import * as process from 'node:process';

import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  path: process.env.SWAGGER_PATH,
  username: process.env.SWAGGER_USERNAME,
  password: process.env.SWAGGER_PASSWORD,
}));
