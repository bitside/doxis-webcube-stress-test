import 'dotenv/config';
// For more information, see https://crawlee.dev/
import { Configuration, PlaywrightCrawler, RequestQueue } from 'crawlee';
import { createRouter, fetchMultipleDocumentUrls, MAX_REQUESTS_PER_CRAWL } from './routes.js';

const requestQueue = await RequestQueue.open();

const crawler = new PlaywrightCrawler({
  requestQueue,
  headless: false,
  preNavigationHooks: [
    // Removes the cookie from the request header
    async ({ request, session }) => {
      session?.setCookie('JSESSIONID=;', request.url);
    },
  ],
  // Don't persist sessions
  // launchContext: {
  //   useIncognitoPages: true,
  // },
  useSessionPool: true,
  persistCookiesPerSession: false,
  requestHandler: createRouter({ requestQueue }),
  // TODO: after this many requests Crawlee will stop
  maxRequestsPerCrawl: MAX_REQUESTS_PER_CRAWL,
});

const documentUrls = await fetchMultipleDocumentUrls();

await crawler.run(documentUrls);
