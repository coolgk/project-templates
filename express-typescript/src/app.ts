import express, { NextFunction, Request, Response, Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import config from './config';
import route from './routes/route';
import { logger } from './utils/logger';

export default (app = express()): Express => {
  app.use(helmet());
  app.use(cors(config.cors));

  route(app);

  app.use((_, response) => response.sendStatus(404));
  app.use((error: Error, _: Request, __: Response, next: NextFunction) => {
    logger.error(error);
    next(error);
  });

  return app;
};
