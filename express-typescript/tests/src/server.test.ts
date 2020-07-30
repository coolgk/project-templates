import sinon from 'sinon';
import { expect } from 'chai';

import * as app from 'src/app';
import { config } from 'src/config';

describe('Server', () => {
  const sandbox = sinon.createSandbox();

  const listenStub = sandbox.stub().callsFake((_, callback: () => void) => {
    callback();
  });

  before(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sandbox.stub(app, 'app').returns({
      listen: listenStub
    });
  });

  after(() => {
    sandbox.restore();
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
