const path = require('path');

function resolveConsumingAppPath(relativePath) {
  return path.resolve(path.join(process.cwd(), relativePath));
}

module.exports = {
  resolveConsumingAppPath
};
