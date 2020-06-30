import { Router, Request, Response } from 'express';
import nocache from 'nocache';

import cacheForever from 'src/middleware/cache-forever';

const router = Router();

router.get('/favicon.ico', cacheForever(), (_: Request, response: Response) => response.sendStatus(204));

router.get('/robots.txt', cacheForever(), (_: Request, response: Response) => {
  response.type('text/plain');
  response.send('User-agent: *\nDisallow: /');
});

router.get('/health-check', nocache(), (_: Request, response: Response) => {
  response.json({ timestamp: new Date() });
});

export default router;
