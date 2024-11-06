import 'dotenv/config';
// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import { createRouter, fetchMultipleDocumentUrls, MAX_REQUESTS_PER_CRAWL } from './routes.js';

const requestQueue = await RequestQueue.open();

const crawler = new PlaywrightCrawler({
  requestQueue,
  headless: false,
  launchContext: {
    useIncognitoPages: true,
  },
  useSessionPool: true,
  persistCookiesPerSession: false,
  requestHandler: createRouter({ requestQueue }),
  // TODO: after this many requests Crawlee will stop
  maxRequestsPerCrawl: MAX_REQUESTS_PER_CRAWL,
});

const documentUrls = await fetchMultipleDocumentUrls();

await crawler.run(documentUrls);
