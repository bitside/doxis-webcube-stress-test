// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, RequestQueue } from 'crawlee';

import { createRouter, fetchDocumentUrlFromHelios, multiplyDocumentUrl } from './routes.js';

const requestQueue = await RequestQueue.open();

const crawler = new PlaywrightCrawler({
  requestQueue,
  headless: false,
  // Ensure that cookies are cleared for every request
  preNavigationHooks: [
    async ({ page }) => {
      await page.context().clearCookies();
    },
  ],
  // Don't persist sessions
  sessionPoolOptions: {
    persistenceOptions: {
        enable: false,
    },
  },
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  requestHandler: createRouter({ requestQueue }),
  // Comment this option to scrape the full website.
  maxRequestsPerCrawl: 5,
});

const documentUrl = await fetchDocumentUrlFromHelios();

await crawler.run(multiplyDocumentUrl(documentUrl, 2));
