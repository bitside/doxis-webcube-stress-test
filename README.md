# Stress Test the WebCube Tomcat

This is a simple stress test for the WebCube Tomcat. It uses the NodeJS Crawlee package to run multiple requests in parallel using a real Playwright Browser (Chromium).

## Getting Started

Before this actually does something useful, you need to adjust the Helios endpoint and response in `routes.ts`. Also replace the `WAIT_FOR_SELECTOR` to wait for a text that
is actually present in the WebCube.

- [ ] Update `HeliosResponse` interface
- [ ] Update `fetchDocumentUrlFromHelios` with real url and request headers
- [ ] Update `WAIT_FOR_SELECTOR` to wait for a text that is actually present in the WebCube

Once that's done, you should be able to run via

```sh
npm install
npm run start
```

NOTE: Once you're sure that everything runs, you can disable the `headless: false` in `main.ts` to run the browser in headless mode (which should be a little faster).