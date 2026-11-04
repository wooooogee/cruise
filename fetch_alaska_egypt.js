async function main() {
  const alaskaUrl = 'https://api.basecamp.team/search/product-with-menu?menu_url=/reservation/Overview&product_type=package&category_id=81697';
  const egyptUrl = 'https://api.basecamp.team/search/product-with-menu?menu_url=/reservation/Overview&product_type=package&category_id=113789';

  const headers = {
    'travel_agent_url': 'www.hdtourzone.com',
    'User-Agent': 'Mozilla/5.0'
  };

  const [alaskaRes, egyptRes] = await Promise.all([
    fetch(alaskaUrl, { headers }),
    fetch(egyptUrl, { headers })
  ]);

  const alaskaData = await alaskaRes.json();
  const egyptData = await egyptRes.json();

  console.log('=== 알래스카 상품 === (총 ' + alaskaData.total_count + '개)');
  (alaskaData.product_list || []).forEach((p, i) => {
    console.log(`${i+1}. [${p.id}] ${p.title} | badge: ${p.badge} | image: ${p.image}`);
  });

  console.log('\n=== 이집트 상품 === (총 ' + egyptData.total_count + '개)');
  (egyptData.product_list || []).forEach((p, i) => {
    console.log(`${i+1}. [${p.id}] ${p.title} | badge: ${p.badge} | image: ${p.image}`);
  });

  const fs = require('fs');
  fs.writeFileSync('alaska_products.json', JSON.stringify(alaskaData, null, 2));
  fs.writeFileSync('egypt_products.json', JSON.stringify(egyptData, null, 2));
}

main().catch(console.error);
