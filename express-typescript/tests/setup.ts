/**
 * test setup file
 */

console.info('test setup file');

export const mochaHooks = {
  beforeAll(): void {
    console.log('global before all');
  },
  afterAll(): void {
    console.log('global after all');
  }
};
