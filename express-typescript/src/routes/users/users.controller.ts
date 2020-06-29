import { Router, Request, Response } from 'express';
import { createUser, getUser, deleteUser } from './users.service';

const router = Router();

router.get('/:id', async (request: Request, response: Response) => {
  const result = await getUser(request.params.id);
  response.json(result);
});

router.post('/', async (request: Request, response: Response) => {
  const result = await createUser({ username: request.body.username });
  response.json(result);
});

router.delete('/:id', async (request: Request, response: Response) => {
  await deleteUser(request.params.id);
  response.json('deleted');
});

export default router;
