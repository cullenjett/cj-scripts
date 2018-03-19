import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';

import indexHtml from './indexHtml';
import fetchDataForRender from './fetchDataForRender';

const App = require(path.resolve(process.cwd(), 'src/App.js')).default;
const configureStore = require(path.resolve(
  process.cwd(),
  'src/utils/configureStore.js'
)).default;

const renderServerSideApp = (req, res) => {
  const store = configureStore(undefined, { logger: false });

  fetchDataForRender(req, store).then(() => {
    const context = {};
    const modules = [];

    const markup = ReactDOMServer.renderToString(
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </Provider>
      </Loadable.Capture>
    );

    let bundles = [];
    if (process.env.NODE_ENV === 'production') {
      const stats = require('../build/react-loadable.json');
      bundles = getBundles(stats, modules);
    }

    if (context.url) {
      res.redirect(context.url);
    } else {
      const helmet = Helmet.renderStatic();
      const fullMarkup = indexHtml({
        initialState: store.getState(),
        bundles,
        helmet,
        markup
      });

      res.status(200).send(fullMarkup);
    }
  });
};

export default renderServerSideApp;
