const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const config = require('../config/webpack.config.dev')

function applyDevMiddleware(app) {
  const compiler = webpack(config)

  app.use(
    webpackDevMiddleware(compiler, {
      hot: true,
      publicPath: config.output.publicPath,
      progress: true,
      stats: {
        colors: true,
        assets: false,
        chunks: false,
        modules: false,
        hash: false,
      },
    })
  )

  app.use(
    webpackHotMiddleware(compiler, {
      path: '/__webpack_hmr',
    })
  )
}

module.exports = {
  applyDevMiddleware,
}
