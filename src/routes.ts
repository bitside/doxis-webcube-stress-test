import { createPlaywrightRouter, RequestQueue, Request } from 'crawlee';
import axios from 'axios';

export interface CreateRouterOptions {
  requestQueue: RequestQueue;
}

interface HeliosResponse {
  documentURL: string;
}

export const CONCURRENCY = parseInt(process.env.CONCURRENCY || '10', 10);
const HELIOS_DOCUMENT_URL = process.env.HELIOS_DOCUMENT_URL!;
const KEYCLOAK_TOKEN = process.env.KEYCLOAK_TOKEN!;
export const MAX_REQUESTS_PER_CRAWL = parseInt(process.env.MAX_REQUESTS_PER_CRAWL || '5', 10);

export const fetchDocumentUrlFromHelios = async (): Promise<string> => {
  // new Request({

  // })
  const response = await axios.get<HeliosResponse>(HELIOS_DOCUMENT_URL, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KEYCLOAK_TOKEN}`,
    },
  });
  return response.data.documentURL;
}

export const fetchMultipleDocumentUrls = async (n: number = CONCURRENCY): Promise<string[]> => {
  return Promise.all([...Array(n)].map((_) => fetchDocumentUrlFromHelios()));
}

export const createRouter = (options: CreateRouterOptions) => {
  const router = createPlaywrightRouter();

  router.addDefaultHandler(async ({ page, request, addRequests, waitForSelector, log }) => {
      const title = await page.title();
      log.info(`${title}`, { url: request.loadedUrl });

      await page.waitForLoadState("domcontentloaded");
      const sessionId = (await page.context().cookies())
        .find((c) => c.name === 'JSESSIONID');
      log.info(`JSESSIONID: ${sessionId?.value ?? 'UNDEFINED'}`);

      // TODO: We want to wait until a specific text appears on the page,
      // so that we can be sure, that the webCube and therefore the Tomcat
      // session have been initialized.
      // const WAIT_FOR_SELECTOR = 'p:has-text("TEXT ON THE PAGE")';
      const WAIT_FOR_SELECTOR = 'body:has-text("Amazon Basics")';
      const TIMEOUT_MS = 10000;
      await waitForSelector(WAIT_FOR_SELECTOR, TIMEOUT_MS);

      const isQueueEmpty = await options.requestQueue.isEmpty();
      const reachedMax = options.requestQueue.assumedHandledCount > MAX_REQUESTS_PER_CRAWL;

      if (isQueueEmpty && !reachedMax) {
        log.info('Request queue is empty. Fetching new document url from Helios.');
        // When the queue is empty, we fetch a new document url from
        // helios and add it to the queue multiple times.
        const documentUrls = await fetchMultipleDocumentUrls();
        await addRequests(documentUrls);
      }
  });

  return router;
}
