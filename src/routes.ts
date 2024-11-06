import { createPlaywrightRouter, RequestQueue } from 'crawlee';
import axios from 'axios';

export interface CreateRouterOptions {
  requestQueue: RequestQueue;
}

// TODO: Adjust to match the real Helios response
interface HeliosResponse {
  documentUrl: string;
}

// TODO: Adjust the request here to actually work with Helios.
export const fetchDocumentUrlFromHelios = async (): Promise<string> => {
  const URL = 'https://url.to.helios/endpoint';
  const response = await axios.get<HeliosResponse>(URL, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ???',
    },
  });
  return response.data.documentUrl;
}

// Takes a document url and returns and array with the same url repeated n times,
// but each one with a different `v=` query param appended. This is required because
// by default, crawlee won't request the same url twice.
export const multiplyDocumentUrl = (documentUrl: string, n: number): string[] => {
  const urls: string[] = [];
  for (let i = 0; i < n; i++) {
    const url = new URL(documentUrl);
    url.searchParams.set('v', `${Math.random()}`);
    urls.push(url.toString());
  }
  return urls;
}

export const createRouter = (options: CreateRouterOptions) => {
  const router = createPlaywrightRouter();

  router.addDefaultHandler(async ({ page, request, addRequests, waitForSelector, log }) => {
      const title = await page.title();
      log.info(`${title}`, { url: request.loadedUrl });

      // TODO: We want to wait until a specific text appears on the page,
      // so that we can be sure, that the webCube and therefore the Tomcat
      // session have been initialized.
      // const WAIT_FOR_SELECTOR = 'p:has-text("TEXT ON THE PAGE")';
      const WAIT_FOR_SELECTOR = 'body:has-text("Amazon Basics")';
      const TIMEOUT_MS = 10000;
      await waitForSelector(WAIT_FOR_SELECTOR, TIMEOUT_MS);

      const isQueueEmpty = await options.requestQueue.isEmpty();
      if (isQueueEmpty) {
        log.info('Request queue is empty. Fetching new document url from Helios.');
        // When the queue is empty, we fetch a new document url from
        // helios and add it to the queue multiple times.
        const documentUrl = await fetchDocumentUrlFromHelios();
        await addRequests(multiplyDocumentUrl(documentUrl, 10));
      }
  });

  return router;
}
