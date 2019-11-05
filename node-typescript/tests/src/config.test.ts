import { expect } from 'chai';

describe('Unit Test: config.ts', () => {
    context('when LOG_LEVEL environment variable is not set', () => {
        it('should use LogLevel.Error as the default log level', () => {
            expect(expectedData.dataForATestCase).to.have.property('value', app);
        });
    });
});
