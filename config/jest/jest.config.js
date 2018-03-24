const path = require('path');

const { resolveConsumingAppPath } = require('../../src/utils');

function resolve(relativePath) {
  return path.resolve(path.join(__dirname, relativePath));
}

const config = {
  rootDir: resolveConsumingAppPath('src'),
  roots: [resolveConsumingAppPath('src')],
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: [resolve('./browserMocks.js')],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)(spec|test).js?(x)'],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.css$': resolve('./cssTransform.js'),
    '^(?!.*\\.(js|jsx|css|json)$)': resolve('./fileTransform.js')
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$',
    '^.+\\.module\\.css$'
  ]
};

module.exports = config;
