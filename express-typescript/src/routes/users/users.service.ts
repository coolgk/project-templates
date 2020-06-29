import { createOne, getOne, deleteOne } from 'src/database';

const TABLE = 'users';

interface IUser {
  id?: string;
  username: string;
}

export const createUser = ({ username }: IUser) => {
  return createOne(TABLE, { id: String(Date.now()), username });
}

export const getUser = (id: string) => {
  return getOne(TABLE, { id });
}

export const deleteUser = (id: string) => {
  return deleteOne(TABLE, { id });
}