const {
  CORS_ORIGIN,
  CSP_SRC,
  LOG_LEVEL,
  ENABLE_SWAGGER,
  PORT,
} = process.env;

export default {
  enableSwagger: ENABLE_SWAGGER,
  baseUrl: '/v1',
  port: PORT || 3000,
  cors: {
    origin: CORS_ORIGIN,
    methods: 'GET'
  },
  csp: {
    // swagger ui requires looser content security policy
    directives: CSP_SRC ? JSON.parse(CSP_SRC) : {
      defaultSrc: ["'self'"]
    }
  },
  logLevel: LOG_LEVEL || 'error'
};
