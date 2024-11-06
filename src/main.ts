import 'dotenv/config';
// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import { createRouter, fetchMultipleDocumentUrls } from './routes.js';

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
  requestHandler: createRouter({ requestQueue }),
  // TODO: after this many requests Crawlee will stop
  maxRequestsPerCrawl: 5,
});

const documentUrls = await fetchMultipleDocumentUrls();

await crawler.run(documentUrls);
