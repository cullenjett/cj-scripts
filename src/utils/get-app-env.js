const { fromAppRoot } = require('../utils/from-app-root')
const packageJson = require(fromAppRoot('package.json'))

process.env.VERSION = packageJson.version

const dotenvVars = require('dotenv').config({ path: fromAppRoot('.env') })
  .parsed
const BAKED_IN_ENV_VARS = ['NODE_ENV', 'PUBLIC_URL', 'VERSION']

function getAppEnv() {
  const raw = Object.keys(dotenvVars || {}).reduce(
    (env, key) => {
      env[key] = process.env[key]
      return env
    },
    {
      NODE_ENV: process.env.NODE_ENV,
      VERSION: process.env.VERSION,
    }
  )

  const forWebpackDefinePlugin = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      if (BAKED_IN_ENV_VARS.includes(key)) {
        env[key] = JSON.stringify(raw[key])
      } else {
        env[key] = `process.env.${key}`
      }
      return env
    }, {}),
  }

  const forIndexHtml = JSON.stringify({
    env: raw,
  })

  return { raw, forIndexHtml, forWebpackDefinePlugin }
}

module.exports = {
  getAppEnv,
}
