async function main() {
  const url = 'https://www.hdtourzone.com/_next/static/chunks/pages/product/[product_id]-ce91f13859cfc376.js';
  const res = await fetch(url);
  const text = await res.text();
  const fs = require('fs');
  fs.writeFileSync('product_chunk.js', text, 'utf-8');
  console.log('Saved product_chunk.js');

  const matches = text.match(/["'](\/[a-zA-Z0-9_\-\/]+)["']/g) || [];
  console.log('Internal paths:', [...new Set(matches)].filter(p => p.includes('product') || p.includes('package') || p.includes('schedule') || p.includes('reference')).slice(0, 20));
}
main();
