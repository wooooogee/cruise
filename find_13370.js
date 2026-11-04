const fs = require('fs');

async function main() {
  const scripts = [
    '/_next/static/chunks/88904-b9f9344bb722ffb9.js',
    '/_next/static/chunks/3334-fd7d2f15b0878402.js',
    '/_next/static/chunks/58773-c330ad3905913f92.js',
    '/_next/static/chunks/6298-ad05ee94ea39fa0f.js',
    '/_next/static/chunks/23457-1f39a0b3dc874f18.js',
    '/_next/static/chunks/35191-363bdc9f89727f63.js',
    '/_next/static/chunks/41485-2e0e9e5cb893b6d2.js',
  ];

  for (const s of scripts) {
    const res = await fetch('https://www.hdtourzone.com' + s);
    const text = await res.text();
    if (text.includes('13370:')) {
      console.log('Found 13370 in', s);
      const idx = text.indexOf('13370:');
      console.log(text.slice(idx, idx + 1000));
    }
  }
}
main();
