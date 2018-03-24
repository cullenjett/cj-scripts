process.env.NODE_ENV = 'test';

process.on('unhandledRejection', err => {
  throw err;
});

const path = require('path');
const jest = require('jest');

const { resolveConsumingAppPath } = require('../utils');
require(resolveConsumingAppPath('config/env'));

const argv = process.argv.slice(2);

if (!process.env.CI && argv.indexOf('--coverage') < 0) {
  argv.push('--watch');
}

if (process.env.CI) {
  argv.push('--runInBand');
}

const configFilePath = path.resolve(
  path.join(__dirname, '../../config/jest/jest.config.js')
);

argv.push('--config', configFilePath);

jest.run(argv);
