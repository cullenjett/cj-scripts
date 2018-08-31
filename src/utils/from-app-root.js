const fs = require('fs')
const path = require('path')
const readPkgUp = require('read-pkg-up')

const { path: packageJsonPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
})

const appDirectory = path.dirname(packageJsonPath)

function fromAppRoot(filePath) {
  return path.join(appDirectory, filePath)
}

module.exports = {
  fromAppRoot,
}
