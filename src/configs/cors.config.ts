import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('cors', () => ({
  origin: process.env.ORIGIN,
  frontendBaseUrl: process.env.FRONTEND_BASE_URL,
}));
