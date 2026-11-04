async function main() {
  const url = 'https://www.hdtourzone.com/_next/data/k00qfURfUYSqWXWcWv_By/master/64814.json';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  console.log('Status:', res.status);
  const data = await res.json();
  const fs = require('fs');
  fs.writeFileSync('master_64814.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log('pageProps keys:', Object.keys(data.pageProps || {}));
  console.log('masterInfo keys:', Object.keys(data.pageProps?.masterInfo || {}));
  console.log('schedule keys/count:', data.pageProps?.schedule?.length);
}
main();
