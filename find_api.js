const fs = require('fs');

async function main() {
  // Try calling common eoding / hdtourzone API endpoints
  // Let's check the bundle JS files from html
  const res = await fetch('https://www.hdtourzone.com/category/reservation/Overview?product_type=package&category_id=86659', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  
  // Find script tags
  const scripts = html.match(/src="(\/_next\/static\/chunks\/[^"]+)"/g) || [];
  console.log('Scripts found:', scripts.length);

  // Search inside scripts for API endpoints
  for (const s of scripts) {
    const src = s.match(/src="([^"]+)"/)[1];
    const jsUrl = 'https://www.hdtourzone.com' + src;
    const jsRes = await fetch(jsUrl);
    const jsText = await jsRes.text();
    const matches = jsText.match(/\/api\/[a-zA-Z0-9_\-\/]+/g);
    if (matches) {
      console.log('Matches in', src, ':', [...new Set(matches)]);
    }
  }
}

main().catch(console.error);
