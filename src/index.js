#!/usr/bin/env node

const path = require('path');
const spawnSync = require('child_process').spawnSync;

const [script, ...args] = process.argv.slice(2);

spawnScript(script, args);

function spawnScript(script, args) {
  const relativeScriptPath = path.join(__dirname, './scripts', script);
  const scriptPath = require.resolve(relativeScriptPath);

  if (!scriptPath) {
    throw new Error(`Unknown script "${script}".`);
  }

  const result = spawnSync('node', [scriptPath, ...args], {
    stdio: 'inherit'
  });

  process.exit(result.status);
}
