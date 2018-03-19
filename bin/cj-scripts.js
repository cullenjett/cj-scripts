#!/usr/bin/env node

const spawnSync = require('child_process').spawnSync;

const [script, ...args] = process.argv.slice(2);

spawnSync('npm', ['run', script, ...args], {
  stdio: 'inherit'
});

process.exit(1);
