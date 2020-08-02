import { expect, use } from 'chai';
import chaiDom from 'chai-dom';
use(chaiDom);
import { devices, BrowserContext, Page, Browser } from 'puppeteer';

import { launchBrowser } from 'tests-e2e/utils/launchBrowser';
import { testPageError } from 'tests-e2e/utils/testPageError';
import { config } from 'tests-e2e/config';
import { config as appConfig } from 'src/config';

describe('Index Page', () => {
  const url = config.baseUrl;

  let browser: Browser;
  let context: BrowserContext;

  before(async () => {
    browser = await launchBrowser({ slowMo: 300 });
    context = await browser.createIncognitoBrowserContext({ device: devices['iPhone X'] });
  });

  after(async () => {
    await browser.close();
  });

  describe('given index page exists', () => {
    describe('when the show error button is clicked', () => {
      let page: Page;

      before(async () => {
        page = await context.newPage(url);
        const button = await page.waitForSelector(`button`);
        await button.click();
      });
      after(async () => page.close());

      it('should show button', async () => {
        const element = await page.$('[data-testid=error-message]');
        const text = (await page.evaluate((element: HTMLElement) => element.textContent, element)) as string;
        expect(text).to.equal(`error message: fetch ${appConfig.api.data}`);
      });

      it(testPageError.name, () => testPageError.assert(page));
    });
  });
});
