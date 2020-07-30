import { ValidationResult } from '@hapi/joi';
import { configSchema } from 'src/validation-schemas/config-schema';

const { CORS_ORIGIN, LOG_LEVEL, PORT, LOG_TRANSPORTS, NODE_ENV } = process.env;

const { value, error } = configSchema.validate({
  rootDir: process.cwd(),
  apiPrefix: '/v1',
  nodeEnv: NODE_ENV,
  port: PORT ?? 3000,
  cors: {
    origin: CORS_ORIGIN ?? true
  },
  logLevel: LOG_LEVEL ?? 'error',
  logTransports: (LOG_TRANSPORTS ?? 'console').split(',').map((transport) => transport.trim())
}) as Omit<ValidationResult, 'value'> & { value: Config };

if (error) throw new Error(error.message);

export const config = value;

export interface Config {
  rootDir: string;
  nodeEnv: string;
  apiPrefix: string;
  port: number;
  cors: {
    origin: string | boolean;
  };
  logLevel: string;
  logTransports: string[];
}
