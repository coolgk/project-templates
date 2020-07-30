import { expect } from 'chai';

describe('App Config', () => {
  context('given env LOG_LEVEL and LOG_TRANSPORTS are not set in the environment variables', () => {
    const { LOG_LEVEL, LOG_TRANSPORTS } = process.env;

    before(() => {
      delete process.env.LOG_LEVEL;
      delete process.env.LOG_TRANSPORTS;
    });

    after(() => {
      process.env.LOG_LEVEL = LOG_LEVEL;
      process.env.LOG_TRANSPORTS = LOG_TRANSPORTS;
    });

    context('when config is imported', () => {
      let config: Record<string, unknown>;

      before(async () => {
        delete require.cache[require.resolve('src/config')];
        config = await import('src/config');
      });

      it('should use default values', () => {
        expect(config.config).to.have.property('logLevel', 'error');
        expect(config.config).to.have.deep.property('logTransports', ['console']);
      });
    });
  });
});
