import { Router, Request, Response } from 'express';
import nocache from 'nocache';

import packageJson from 'package.json';
import cacheForever from 'src/middleware/cache-forever';

const router = Router();

router.get('/favicon.ico', cacheForever(), (_request: Request, response: Response) => response.sendStatus(204));

router.get('/robots.txt', cacheForever(), (_request: Request, response: Response) => {
  response.type('text/plain');
  response.send('User-agent: *\nDisallow: /');
});

router.use('/health-check', nocache(), (_request: Request, response: Response) => {
  response.json({ version: packageJson.version, timestamp: new Date() });
});

export default router;
