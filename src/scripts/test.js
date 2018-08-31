process.on('unhandledRejection', (err) => {
  throw err
})

process.env.NODE_ENV = 'test'

const jest = require('jest')
const path = require('path')

const { getAppEnv } = require('../utils/get-app-env')
const args = process.argv.slice(2)
const localConfigPath = path.join(__dirname, '../config/jest/jest.config.js')

getAppEnv()

args.push('--config', localConfigPath)

if (!process.env.CI && args.indexOf('--coverage') < 0) {
  args.push('--watch')
}

if (process.env.CI) {
  args.push('--runInBand')
}

jest.run(args)
