import { Router, Express } from 'express';

import config from 'src/config';
import favicon from './favicon/favicon';
import robotsTxt from './robots.txt/robots.txt';
import healthCheck from './health-check/health-check';

import users from './users/users.controller';

export default (app: Express) => {
  app.get('/favicon.ico', favicon);
  app.get('/robots.txt', robotsTxt);
  app.use('/health-check', healthCheck);

  if (config.enableSwagger === 'true') {
    app.use('/swagger', ...require('./swagger/swagger').default);
  }

  const router = Router();
  router.use('/users', users);

  app.use(config.baseUrl, router);
};
