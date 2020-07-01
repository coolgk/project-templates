import sinon, { SinonStub } from 'sinon';
import { expect } from 'chai';

import * as app from 'src/app';
import config from 'src/config';

describe('Server', () => {
  const listenStub = sinon.stub().callsFake((_, callback: () => void) => {
    callback();
  });

  before(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sinon.stub(app, 'default').returns({
      listen: listenStub
    });
  });

  after(() => {
    (app.default as SinonStub).restore();
  });

  context(`when server starts`, () => {
    before(async () => {
      await import('src/server');
    });

    it(`should listen on port ${config.port}`, () => {
      expect(listenStub.calledWith(config.port));
    });
  });
});
