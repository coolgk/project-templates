import { Page } from 'puppeteer';

export const testPageError = {
  name: 'should not have errors on page',
  assert: (page: Page): void => {
    const errors = page.errors.filter(({ type }) => type !== 'console-error' && type !== 'request-failed');
    const warnings = page.errors.filter(({ type }) => type === 'console-error' || type === 'request-failed');

    // eslint-disable-next-line no-console
    warnings.length && console.warn(warnings);

    if (errors.length) {
      console.error(errors);
      throw new Error('Found errors in page');
    }
  }
};
