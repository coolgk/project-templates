import supertest from 'supertest';
import { expect } from 'chai';

import { app } from 'src/app';

describe('Root Urls', () => {
  context('given server is up', () => {
    context('when GET /health-check request is received', () => {
      let response: supertest.Test;
      before(() => {
        response = supertest(app()).get('/health-check');
      });

      it('should respond with http status 200', () => {
        return response.expect(200);
      });

      it('should send timestamp', async () => {
        expect((await response).body).to.have.property('timestamp');
      });
    });

    context('when GET /favicon.ico request is received', () => {
      it('should respond with status 204', () => {
        return supertest(app()).get('/favicon.ico').expect(204);
      });
    });

    context('when GET /robots.txt request is received', () => {
      let response: supertest.Test;
      before(() => {
        response = supertest(app())
          .get('/robots.txt')
          .expect('Content-Type', /text\/plain/);
      });

      it('should respond with http status 200', () => {
        return response.expect(200);
      });

      it('should respond with User-agent: *\nDisallow: /', async () => {
        expect((await response).text).to.equal('User-agent: *\nDisallow: /');
      });
    });
  });
});
