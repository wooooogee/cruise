async function main() {
  const url = 'https://api.basecamp.team/search/product-with-menu?menu_url=/reservation/Overview&product_type=package&category_id=86659';
  const res = await fetch(url, {
    headers: {
      'travel_agent_url': 'www.hdtourzone.com',
      'User-Agent': 'Mozilla/5.0'
    }
  });
  console.log('Status:', res.status);
  const data = await res.json();
  const fs = require('fs');
  fs.writeFileSync('products_86659.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log('Total count:', data.total_count);
  if (data.product_list) {
    console.log('Found', data.product_list.length, 'products:');
    data.product_list.forEach((p, i) => {
      console.log(`${i+1}. [${p.id}] ${p.title} (선사/지역: ${p.hash_tag_list || ''})`);
    });
  }
}

main().catch(console.error);
