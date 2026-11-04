const fs = require('fs');
// Let's find product link in category_chunk or related chunks
const scripts = [
  '/_next/static/chunks/pages/category/%5Bmenu%5D/%5Bsub_menu%5D-46ec88a8a7950ad6.js',
  '/_next/static/chunks/88904-b9f9344bb722ffb9.js',
  '/_next/static/chunks/3334-fd7d2f15b0878402.js',
  '/_next/static/chunks/58773-c330ad3905913f92.js',
  '/_next/static/chunks/6298-ad05ee94ea39fa0f.js',
  '/_next/static/chunks/23457-1f39a0b3dc874f18.js',
  '/_next/static/chunks/35191-363bdc9f89727f63.js',
  '/_next/static/chunks/41485-2e0e9e5cb893b6d2.js',
];

async function main() {
  for (const s of scripts) {
    const res = await fetch('https://www.hdtourzone.com' + s);
    const text = await res.text();
    // Look for href or router.push or `/product/` or `/package/`
    const matches = text.match(/href:[^,}]*|router\.push\([^)]*\)/g) || [];
    const linkMatches = matches.filter(m => m.includes('id') || m.includes('product') || m.includes('detail') || m.includes('tour'));
    if (linkMatches.length > 0) {
      console.log('In', s, ':', linkMatches.slice(0, 10));
    }
  }
}
main();
