process.on('unhandledRejection', (err) => {
  throw err
})

require('babel-register')({
  plugins: [
    require.resolve('babel-plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-dynamic-import-node'),
    [
      require.resolve('babel-plugin-import-noop'),
      {
        extensions: ['graphql', 'scss', 'css'],
      },
    ],
  ],
})

process.env.NODE_ENV = 'development'

if (!process.env.PUBLIC_URL) {
  process.env.PUBLIC_URL = ''
}

const chalk = require('chalk')
const clearConsole = require('react-dev-utils/clearConsole')
const {
  choosePort,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils')
const express = require('express')
const openBrowser = require('react-dev-utils/openBrowser')

const { applyDevMiddleware } = require('../utils/dev-middleware')
const { fromAppRoot } = require('../utils/from-app-root')
const { getAppEnv } = require('../utils/get-app-env')

const APP_PATH = process.env.CJ_SCRIPTS_APP_PATH || 'server/app'
const { app } = require(fromAppRoot(APP_PATH))

const DEFAULT_PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'
const isInteractive = process.stdout.isTTY

const server = express()

getAppEnv()

applyDevMiddleware(server)

server.use(app)

choosePort(HOST, DEFAULT_PORT)
  .then((port) => {
    if (!port) {
      return
    }

    const urls = prepareUrls('http', HOST, port)

    server.listen(port, HOST, (err) => {
      if (err) {
        return console.log(err)
      }

      if (isInteractive) {
        clearConsole()
      }

      console.log(
        chalk.blue(`
          * Running locally at ${urls.localUrlForBrowser}
          * Running on your network at ${urls.lanUrlForConfig}:${port}
        `),
        chalk.gray(`
          Starting dev server...
        `)
      )

      openBrowser(urls.localUrlForBrowser)
    })
  })
  .catch((err) => {
    console.log(err)
  })
