const url = require('url');
const { matchPath } = require('react-router-dom');

const ROUTES_THAT_FETCH_DATA = [];

function fetchDataForRender(req, store) {
  const promises = [];

  ROUTES_THAT_FETCH_DATA.some(route => {
    const match = matchPath(url.parse(req.url).pathname, route);
    if (match) {
      const promise =
        route.component &&
        route.component.fetchData &&
        route.component.fetchData(store, match);
      promises.push(promise);
    }
    return match;
  });

  return Promise.all(promises);
}

module.exports = fetchDataForRender;
