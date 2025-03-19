#!/usr/bin/env node

function loadSlink() {
  const relPath = './slink.js'; // relative to this file

  const fs = require('fs');
  const path = require('path');

  const me = process.argv[1];
  const loadPath = path.join(path.dirname(me), relPath);
  if (!fs.existsSync(loadPath)) {
    process.stderr.write(`Error: ${loadPath}: file not found}\n`);
    process.exit(1);
  }

  return require(loadPath);
}

const Slink = loadSlink();
let slink = new Slink(process.argv[2], process.argv[3]);
process.stdout.write(JSON.stringify({ ok: true }) + '\n');

let buffer = '';

process.stdin.on('data', (data) => {
  buffer += data;
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop();
  lines.forEach(line => {
    const parts = line.trim().split(' ');
    const cmd = parts.shift();
    const str = parts.join(' ');

    if (cmd === 'hello') {
      const out = slink.Hello(str);
      process.stdout.write(JSON.stringify(out) + '\n');
    } else {
      process.stderr.write(`Unknown command: ${line}`);
    }
  });
});
