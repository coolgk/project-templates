import { Request, Response } from 'express';

export default (_request: Request, response: Response) => response.sendStatus(204);