import * as process from 'node:process';

import { registerAs } from '@nestjs/config';

export default registerAs('cors', () => ({
  origin: process.env.ORIGIN,
  credentials: !process.env.CREDENTIALS,
}));
