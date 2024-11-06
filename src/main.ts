import 'dotenv/config';
// For more information, see https://crawlee.dev/
import { Configuration, PlaywrightCrawler, RequestQueue } from 'crawlee';
import { createRouter, fetchMultipleDocumentUrls, MAX_REQUESTS_PER_CRAWL } from './routes.js';

const requestQueue = await RequestQueue.open();

const crawler = new PlaywrightCrawler({
  requestQueue,
  headless: false,
  // Ensure that cookies are cleared for every request
  // preNavigationHooks: [
  //   async ({ page }) => {
  //     await page.context().clearCookies();
  //   },
  // ],
  // Don't persist sessions
  useSessionPool: true,
  persistCookiesPerSession: false,
  requestHandler: createRouter({ requestQueue }),
  // TODO: after this many requests Crawlee will stop
  maxRequestsPerCrawl: MAX_REQUESTS_PER_CRAWL,
});

const documentUrls = await fetchMultipleDocumentUrls();

await crawler.run(documentUrls);
