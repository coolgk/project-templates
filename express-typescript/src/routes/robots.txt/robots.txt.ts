import { Request, Response } from 'express';

export default (_request: Request, response: Response) => {
  response.type('text/plain');
  response.send('User-agent: *\nDisallow: /');
};