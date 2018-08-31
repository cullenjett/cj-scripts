const fs = require('fs')
const path = require('path')

const { fromAppRoot } = require('../../utils/from-app-root')

const fromHere = (p) => path.join(__dirname, p)

const setupTestFrameworkScriptFile = fs.existsSync(
  fromAppRoot('/config/setupTests.js')
)
  ? '<rootDir>/config/setupTests.js'
  : undefined

module.exports = {
  rootDir: fromAppRoot('/'),
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupTestFrameworkScriptFile,
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)(spec|test).js?(x)'],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx)$': fromHere('./babel-transform.js'),
    '^.+\\.(graphql)$': fromHere('./graphql-transform.js'),
    '^.+\\.css$': fromHere('./css-transform.js'),
    '^(?!.*\\.(js|jsx|mjs|css|json|graphql)$)': fromHere('./file-transform.js'),
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
}
