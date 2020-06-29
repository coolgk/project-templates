import { expect } from 'chai';
// import sinon from 'sinon';
import supertest from 'supertest';

import app from 'src/app';

describe('Users', () => {
  context('given no users in the database', () => {
    context('when POST /v1/users is made', () => {
      const username = `random${Math.random()}`;

      let response: supertest.Response;
      before(async () => {
        response = await supertest(app).post('/v1/users').send({ username }).expect(200);
      });

      it('should send an user object with id', () => {
        expect(response.body).to.have.property('id', '1');
        expect(response.body).to.have.property('username', username);
      });
    });
  });
});
