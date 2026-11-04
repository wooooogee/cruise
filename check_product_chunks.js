async function main() {
  const res = await fetch('https://www.hdtourzone.com/_next/static/k00qfURfUYSqWXWcWv_By/_buildManifest.js');
  const text = await res.text();
  const idx = text.indexOf('"/product/[product_id]"');
  console.log(text.slice(idx, idx + 400));
}
main();
