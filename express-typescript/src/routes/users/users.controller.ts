import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { findAll, createOne, User } from './users.service';

const router = Router();

router
  .route('/')
  .get((_: Request, response: Response) => {
    response.json(findAll());
  })
  .post(bodyParser.json(), (request: Request, response: Response) => {
    response.json(createOne({ username: (request.body as Omit<User, 'id'>).username }));
  });

// router.get('/:id', (request: Request, response: Response) => {
//   response.json(findOne(request.params.id));
// });

// router.delete('/:id', (request: Request, response: Response) => {
//   deleteOne(request.params.id);
//   response.sendStatus(204);
// });

export default router;
