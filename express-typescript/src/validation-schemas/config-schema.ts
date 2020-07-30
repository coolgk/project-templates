import joi from '@hapi/joi';

export const configSchema = joi
  .object({
    rootDir: joi.string(),
    nodeEnv: joi.string().valid('production', 'development', 'staging'),
    apiPrefix: joi.string(),
    port: joi.number(),
    cors: {
      origin: joi.string().uri().allow('localhost', true)
    },
    logLevel: joi.string().valid('error', 'debug', 'info'),
    logTransports: joi.array().items(joi.string().valid('console'))
  })
  .options({ presence: 'required' });
