const { CORS_ORIGIN, LOG_LEVEL, PORT, LOG_TRANSPORTS } = process.env;

export default {
  apiPrefix: '/v1',
  port: PORT || 3000,
  cors: {
    origin: CORS_ORIGIN || '*'
  },
  logLevel: LOG_LEVEL || 'error',
  logTransports: (LOG_TRANSPORTS || 'console').split(',').map((transport) => transport.trim())
};
