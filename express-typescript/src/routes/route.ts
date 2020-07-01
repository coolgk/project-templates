import { Router, Express } from 'express';

import config from 'src/config';

import rootController from 'src/routes/root/root.controller';
import users from './users/users.controller';

export default (app: Express): void => {
  app.use(rootController);

  const api = Router();
  api.use('/users', users);

  app.use(config.apiPrefix, api);
};
