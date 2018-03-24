const os = require('os');
const path = require('path');
const express = require('express');
const shrinkRay = require('shrink-ray');
const helmet = require('helmet');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const morgan = require('morgan');

const config = require('../config/webpack.config.dev');
const renderServerSideApp = require('./renderServerSideApp');

const app = express();

if (process.env.PUBLIC_URL === undefined) {
  throw new Error('process.env.PUBLIC_URL must be defined.');
}

app.use(shrinkRay());
app.use(helmet());

function toMb(bytes) {
  return Math.floor(bytes / 1024 / 1024);
}

app.get('/system', (req, res) => {
  const processMem = process.memoryUsage();
  const stats = {
    memory: {
      system: {
        free: toMb(os.freemem()),
        total: toMb(os.totalmem())
      },
      process: {
        rss: toMb(processMem.rss),
        heapTotal: toMb(processMem.heapTotal),
        heapUsed: toMb(processMem.heapUsed)
      }
    },
    loadavg: os.loadavg(),
    cpuCount: os.cpus().length,
    uptime: {
      system: Math.floor(os.uptime()),
      process: Math.floor(process.uptime())
    }
  };

  res.json(stats);
});

app.use(
  process.env.PUBLIC_URL,
  express.static(path.join(process.cwd(), './build'), {
    maxage: '30 days'
  })
);

app.use(
  process.env.PUBLIC_URL,
  express.static(path.join(process.cwd(), './public'), {
    maxage: '30 days'
  })
);

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(config);

  app.use(
    webpackDevMiddleware(compiler, {
      hot: true,
      publicPath: config.output.publicPath,
      progress: true,
      stats: {
        colors: true,
        assets: true,
        chunks: false,
        modules: false,
        hash: false
      }
    })
  );

  app.use(
    webpackHotMiddleware(compiler, {
      path: '/__webpack_hmr',
      heartbeat: 4000
    })
  );
}

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
}

app.get('*', renderServerSideApp);

module.exports = app;
