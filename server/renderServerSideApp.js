const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { Provider } = require('react-redux');
const { StaticRouter } = require('react-router-dom');
const { Helmet } = require('react-helmet');
const Loadable = require('react-loadable');
const { getBundles } = require('react-loadable/webpack');

const { resolveConsumingAppPath } = require('../src/utils');
const indexHtml = require('./indexHtml');
const fetchDataForRender = require('./fetchDataForRender');
const App = require(resolveConsumingAppPath('src/App.js')).default;
const configureStore = require(resolveConsumingAppPath(
  'src/utils/configureStore.js'
)).default;

function renderServerSideApp(req, res) {
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

    const stats = require(resolveConsumingAppPath('build/react-loadable.json'));
    const bundles = getBundles(stats, modules);

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
}

module.exports = renderServerSideApp;
