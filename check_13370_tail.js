const fs = require('fs');

async function main() {
  const res = await fetch('https://www.hdtourzone.com/_next/static/chunks/41485-2e0e9e5cb893b6d2.js');
  const text = await res.text();
  const idx = text.indexOf('13370:');
  console.log(text.slice(idx + 3000, idx + 6000));
}
main();
