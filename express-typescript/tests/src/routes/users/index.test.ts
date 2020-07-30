import { expect } from 'chai';
import supertest from 'supertest';
import * as userService from 'src/services/user-service';

import { app } from 'src/app';

describe('Users', () => {
  beforeEach(() => {
    userService.users.splice(0, userService.users.length);
  });

  context('given no users in the database', () => {
    context('when POST /v1/users is made', () => {
      const username = `random${Math.random()}`;

      let response: supertest.Response;
      before(async () => {
        response = await supertest(app()).post('/v1/users').send({ username }).expect(200);
      });

      it('should respond with created user object', () => {
        expect(response.body).to.have.property('id', '1');
        expect(response.body).to.have.property('username', username);
      });
    });

    context('given some users are in the db', () => {
      const users = [
        { id: '1', username: 'abc' },
        { id: '2', username: 'xyz' }
      ];

      beforeEach(() => {
        userService.users.push(...users);
      });

      context('when GET /v1/users is received', () => {
        let response: supertest.Response;
        beforeEach(async () => {
          response = await supertest(app()).get('/v1/users').expect(200);
        });
        it('should respond with all users', () => {
          expect(response.body).to.deep.equal(users);
        });
      });
    });
  });
});
