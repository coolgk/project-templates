import { Request, Response } from 'express';
import packageJson from 'package.json';

export default (_request: Request, response: Response) => {
  response.json({ version: packageJson.version, timestamp: new Date() });
};
