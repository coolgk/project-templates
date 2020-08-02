import { resolve } from 'path';
import puppeteer, {
  Page,
  ScreenshotOptions,
  LaunchOptions,
  Browser,
  devices,
  BrowserContext,
  DirectNavigationOptions
} from 'puppeteer';

import { config } from 'tests-e2e/config';

interface ContextOptions {
  device?: devices.Device;
}

export interface PageError {
  url: string;
  type: string;
  message: unknown;
}

declare module 'puppeteer' {
  interface Page {
    takeScreenshot: (name: string, options?: ScreenshotOptions) => Promise<ElementHandle>;
    errors: PageError[];
  }

  interface Browser {
    createIncognitoBrowserContext(options?: ContextOptions): Promise<BrowserContext>;
  }

  interface BrowserContext {
    newPage(url: string, options?: DirectNavigationOptions): Promise<Page>;
  }
}

export async function launchBrowser(puppeteerLaunchOptions: LaunchOptions = {}): Promise<Browser> {
  const browser = await puppeteer.launch({
    devtools: !config.headless,
    headless: config.headless,
    timeout: 5000,
    ignoreHTTPSErrors: true,
    ...puppeteerLaunchOptions
  });

  return new Proxy(browser, {
    get: function (target, property, receiver) {
      if (property === 'createIncognitoBrowserContext') {
        return async (contextOptions: ContextOptions) => {
          const context = await target.createIncognitoBrowserContext();
          return new Proxy(context, {
            get: getContextProxyGetHandler(contextOptions)
          });
        };
      }
      return Reflect.get(target, property, receiver) as unknown;
    }
  });
}

function getContextProxyGetHandler({ device }: ContextOptions = {}) {
  return function contextProxyGetHandler(context: BrowserContext, property: PropertyKey, receiver: unknown) {
    switch (property) {
      case 'newPage':
        return async (url: string, options?: DirectNavigationOptions) => {
          const page = await context.newPage();
          if (device) await page.emulate(device);
          if (url) {
            await page.goto(url, options);
          }

          const errors: PageError[] = [];
          recordPageError(page, errors);

          return new Proxy(page, {
            get: getPageProxyGetHandler(errors)
          });
        };
      default:
        return Reflect.get(context, property, receiver) as unknown;
    }
  };
}

function getPageProxyGetHandler(errors: PageError[]) {
  return function pageProxyGetHandler(page: Page, property: PropertyKey, receiver: unknown) {
    switch (property) {
      case 'takeScreenshot':
        return (name: string, options?: ScreenshotOptions) => takeScreenshot(page, name, options);
      case 'errors':
        return errors;
      default:
        return Reflect.get(page, property, receiver) as unknown;
    }
  };
}

export function takeScreenshot(page: Page, name: string, options?: ScreenshotOptions): ReturnType<Page['screenshot']> {
  return page.screenshot({ path: resolve(process.cwd(), 'tests-e2e', 'screenshots', name), ...options });
}

export function recordPageError(page: Page, errors: PageError[]): void {
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push({ url: page.url(), type: 'console-error', message: message.text() });
    }
  });

  page.on('pageerror', (exception) => {
    errors.push({ url: page.url(), type: 'page-error', message: exception });
  });

  page.on('requestfailed', (request) => {
    errors.push({ url: page.url(), type: 'request-failed', message: request });
  });

  page.on('error', (error) => {
    errors.push({ url: page.url(), type: 'error', message: error });
  });
}
