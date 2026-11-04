async function run() {
  const res = await fetch('https://www.hdtourzone.com/category/reservation/Overview?product_type=package&category_id=86659', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const text = await res.text();
  const nextMatch = text.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (nextMatch) {
    const data = JSON.parse(nextMatch[1]);
    const pageProps = data.props?.pageProps;
    console.log('Keys in pageProps:', Object.keys(pageProps || {}));
    // Check if there are category or product lists
    const fs = require('fs');
    fs.writeFileSync('pageProps.json', JSON.stringify(pageProps, null, 2), 'utf-8');
    console.log('Saved pageProps.json');
  } else {
    console.log('No NEXT_DATA');
  }
}
run().catch(console.error);
