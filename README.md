# Stress Test the WebCube Tomcat

This is a simple stress test for the WebCube Tomcat. It uses the NodeJS Crawlee package to run multiple requests in parallel using a real Playwright Browser (Chromium).

## Getting Started

Copy the `.env.template` to `.env` and fill in the environment variables.

```sh
cp .env.template .env
```
Once that's done, you should be able to run via

```sh
npm install
npm run start
```

NOTE: Once you're sure that everything runs, you can disable the `headless: false` in `main.ts` to run the browser in headless mode (which should be a little faster).