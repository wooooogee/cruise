async function main() {
  const res = await fetch('https://www.hdtourzone.com/_next/static/k00qfURfUYSqWXWcWv_By/_buildManifest.js');
  const text = await res.text();
  console.log(text.slice(0, 3000));
}
main();
