const users: User[] = [];

export interface User {
  id: string;
  username: string;
}

export const createOne = ({ username }: Omit<User, 'id'>): User => {
  const user = { id: String(users.length + 1), username };
  users.push(user);
  return user;
};

export const findOne = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

export const findAll = (): User[] => {
  return users;
};

export const deleteOne = (id: string): void => {
  users.splice(
    users.findIndex((user) => user.id === id),
    1
  );
};
