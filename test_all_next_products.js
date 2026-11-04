async function main() {
  const p = require('./products_86659.json');
  for (const item of p.product_list) {
    const url = `https://www.hdtourzone.com/_next/data/k00qfURfUYSqWXWcWv_By/product/${item.id}.json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await res.json();
    if (data.pageProps?.productInfo) {
      console.log(`Product ${item.id} (${item.title}) has productInfo!`);
    } else {
      console.log(`Product ${item.id} redirect to:`, data.pageProps?.__N_REDIRECT);
    }
  }
}
main();
