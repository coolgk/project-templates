import { Request, Response, NextFunction } from 'express';

import logger from './logger';

process.on('unhandledRejection', (error: Error) => {
  logger.log.error(error.message);
  logger.log.debug(JSON.stringify(error));
});

export const handle404Error = (_request: Request, response: Response) => {
  response.sendStatus(404);
};

export const handleAllError = (error: Error, _request: Request, response: Response, next: NextFunction) => {
  logger.log.error(error.message);
  logger.log.debug(JSON.stringify(error));
  if (response.headersSent) {
    next(error);
  } else {
    response.sendStatus(500);
  }
};
