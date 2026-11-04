const fs = require('fs');

async function main() {
  const res = await fetch('https://www.hdtourzone.com/category/reservation/Overview?product_type=package&category_id=86659', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  
  // Find all js script tags
  const scripts = [...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map(m => m[1]);
  console.log('All scripts:', scripts);

  for (const src of scripts) {
    const jsUrl = 'https://www.hdtourzone.com' + src;
    const jsRes = await fetch(jsUrl);
    const jsText = await jsRes.text();
    // Search for url patterns like /product or /category or api or fetch
    const urls = jsText.match(/https?:\/\/[a-zA-Z0-9.\-_/:]+/g) || [];
    const internalApis = jsText.match(/["'](\/[a-zA-Z0-9_\-\/]*(?:product|category|reservation|package|item)[a-zA-Z0-9_\-\/]*)["']/g) || [];
    if (internalApis.length > 0) {
      console.log('Internal in', src, ':', [...new Set(internalApis)].slice(0, 10));
    }
  }
}

main().catch(console.error);
