async function main() {
  const res = await fetch('https://www.hdtourzone.com/product/64814', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  console.log('Status:', res.status);
  const text = await res.text();
  const nextMatch = text.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (nextMatch) {
    const data = JSON.parse(nextMatch[1]);
    const fs = require('fs');
    fs.writeFileSync('product_page_64814.json', JSON.stringify(data.props?.pageProps, null, 2), 'utf-8');
    console.log('Saved product_page_64814.json, keys:', Object.keys(data.props?.pageProps || {}));
  } else {
    console.log('No next match');
  }
}
main();
