process.env.NODE_ENV = 'production'

if (!process.env.PUBLIC_URL) {
  process.env.PUBLIC_URL = ''
}

const chalk = require('chalk')
const FileSizeReporter = require('react-dev-utils/FileSizeReporter')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const rimraf = require('rimraf')
const webpack = require('webpack')

const config = require('../config/webpack.config.prod')
const { fromAppRoot } = require('../utils/from-app-root')
const { getAppEnv } = require('../utils/get-app-env')

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

getAppEnv()

measureFileSizesBeforeBuild(fromAppRoot('/build'))
  .then((previousFileSizes) => {
    rimraf.sync(fromAppRoot('/build'))
    return build(previousFileSizes)
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'))
        console.log(warnings.join('\n\n'))
      } else {
        console.log(chalk.green('Compiled successfully.\n'))
      }

      console.log('File sizes after gzip:\n')
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        fromAppRoot('/build'),
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      )
      console.log()
    },
    (err) => {
      console.log(chalk.red('Failed to compile.\n'))
      console.log((err.message || err) + '\n')
      process.exit(1)
    }
  )

function build(previousFileSizes) {
  console.log(
    chalk.blue(`
      Creating an optimized production build...
    `)
  )

  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }

      const messages = formatWebpackMessages(stats.toJson({}, true))

      if (messages.errors.length) {
        return reject(new Error(messages.errors.join('\n\n')))
      }

      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      })
    })
  })
}
