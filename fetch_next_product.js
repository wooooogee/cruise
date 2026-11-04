async function main() {
  const url = 'https://www.hdtourzone.com/_next/data/k00qfURfUYSqWXWcWv_By/product/64814.json';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  console.log('Status:', res.status);
  const data = await res.json();
  const fs = require('fs');
  fs.writeFileSync('next_product_64814.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log('Keys in pageProps:', Object.keys(data.pageProps || {}));
  console.log('Keys in productInfo:', Object.keys(data.pageProps?.productInfo || {}));
}
main();
