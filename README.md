# `cj-scripts` 💻

Scripts for front end gangsters writing React apps.

## What is it?

`cj-scripts` is a CLI that abstracts ~~linting~~, ~~formatting~~, transpiling, testing, building, and serving React projects into one dependency. Think of it like a poor man's [react-scripts](https://github.com/facebook/create-react-app/tree/next/packages/react-scripts).

Here are some things included:
- Webpack config for dev and prod
- Dev middleware attached to your Express application with hot reloading
- Babel configuration
- `.env` file support
- Configured Jest testing
- Multi-core utilzation for production builds

## How do I use it?

1. Install it:
```
  npm i cj-scripts
```

2. Create a `.env` file at the root of your app for your environment variables.

3. Add `cj-scripts/babel` as a preset to your `.babelrc` (but Babel itself is not required):

```json
{
  "presets": ["cj-scripts/babel"]
}
```

4. Create a `src/index.js` file that bootstraps your client-side app.

5. Export an Express application at `server/app.js` called `app`. This should probably route to your client-side app, serve static assets, and any other logic you might want (except for dev middleware, that's included when running `cj-scripts start`).

```javascript
  import express from 'express';

  export const app = express();

  // your server logic...
```

5. Run any of the commands below within the context of your app (i.e. put them in your `package.json` scripts)

## Commands

#### `cj-scripts start`

- Start your Express app with development middleware attached.
- This command expects `src/index.js` as the bootstrap file for your client-side app.
- By default this will look for a named export of an Express server/router called `app` in `/server/app.js`, but this path can be changed with the `CJ_SCRIPTS_APP_PATH` environment variable.
- The `PORT` environment variable can also be used to dictate the port (the default value is `3000`).

#### `cj-scripts test`

- Fire up [Jest](https://jestjs.io/) in watch mode or optimized for CI based on the environment.
- You can add a file at `config/setupTests.js` in your app to run initialization code for testing (think Enzyme adapter setup or global overrides).

#### `cj-scripts build`

- Build the production assets into a `build` directory at the root of your app.
- The `PUBLIC_URL` environment variable can be set to serve your app at a path other than the root.

#### `cj-scripts start-prod`

- Run your Express app in production mode using the `cluster` module to take advantage of multiple cores.
- The `PUBLIC_URL` environment variable can be set to serve your app at a path other than the root.
- The `PORT` environment variable can also be used to dictate the port (the default value is `3000`).

## Utilities

```javascript
import { getAppEnv } from 'cj-scripts'

const env = getAppEnv()
```

You can use `getAppEnv()` to collect environment variables from a `.env` file at the root of your app.
