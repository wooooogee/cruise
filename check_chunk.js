const fs = require('fs');

async function main() {
  const jsUrl = 'https://www.hdtourzone.com/_next/static/chunks/pages/category/%5Bmenu%5D/%5Bsub_menu%5D-46ec88a8a7950ad6.js';
  const jsRes = await fetch(jsUrl);
  const jsText = await jsRes.text();
  fs.writeFileSync('category_chunk.js', jsText, 'utf-8');
  console.log('Saved category_chunk.js, length:', jsText.length);

  // Search for queries or apis
  const regex = /["']([^"']*(?:category|product|reservation)[^"']*)["']/g;
  const matches = [...jsText.matchAll(regex)].map(m => m[1]);
  console.log('Matches:', [...new Set(matches)].slice(0, 30));
}

main().catch(console.error);
