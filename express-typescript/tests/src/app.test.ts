import supertest from 'supertest';
import express from 'express';
import sinon, { SinonStub } from 'sinon';
import { expect } from 'chai';

import { app } from 'src/app';
import { getRandomString } from 'tests/utils';
import { logger } from 'src/utils/logger';

describe('App', () => {
  const randomUrl = getRandomString('/url');
  context(`given ${randomUrl} endpoint does not exist`, () => {
    context(`when GET ${randomUrl} request is received`, () => {
      let response: supertest.Test;
      before(() => {
        response = supertest(app()).get(randomUrl);
      });

      it('should respond with 404', () => {
        return response.expect(404);
      });
    });
  });

  context(`given /error endpoint contains error`, () => {
    const appError = express();
    appError.get('/error', (_, __, next) => {
      next('mockederror');
    });

    before(() => {
      sinon.stub(logger, 'error');
    });

    after(() => {
      (logger.error as SinonStub).restore();
    });

    context(`when GET /error request is received`, () => {
      let response: supertest.Test;
      before(() => {
        response = supertest(app(appError)).get('/error');
      });

      it('should respond with 500', () => {
        return response.expect(500);
      });

      it('should log error', () => {
        expect((logger.error as SinonStub).calledWith('mockederror')).to.be.true;
      });
    });
  });
});
