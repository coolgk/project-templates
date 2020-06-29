import { Request, Response, NextFunction } from 'express';

export default function cacheForever(whatDoesForeverMean = 2592000) {
  return (_: Request, response: Response, next: NextFunction): void => {
    response.set('Cache-Control', `public, max-age=${whatDoesForeverMean}, immutable`); // 30 days
    next();
  };
}
