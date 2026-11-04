async function main() {
  const res = await fetch('https://www.hdtourzone.com/_next/static/k00qfURfUYSqWXWcWv_By/_buildManifest.js');
  const text = await res.text();
  const pages = text.match(/"\/[a-zA-Z0-9_\-\/\[\]]+"/g) || [];
  const filtered = [...new Set(pages)].filter(p => p.includes('product') || p.includes('package') || p.includes('master'));
  console.log('Routes:', filtered);
}
main();
