#!/usr/bin/env node

const path = require('path')
const { spawnSync } = require('child_process')

const [script, ...args] = process.argv.slice(2)

runScript(script, args)

function runScript(scriptName = '', args = []) {
  const relativeScriptPath = path.join(__dirname, './scripts', scriptName)
  const scriptPath = attemptResolve(relativeScriptPath)

  if (!scriptPath) {
    throw new Error(`Unknown script "${script}".`)
  }

  const result = spawnSync('node', [scriptPath, ...args], {
    stdio: 'inherit',
  })

  process.exit(result.status)
}

function attemptResolve(path) {
  try {
    return require.resolve(path)
  } catch (error) {
    return null
  }
}
