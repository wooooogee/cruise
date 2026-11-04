async function testProductApi(id) {
  const urls = [
    `https://api.basecamp.team/product/package/${id}`,
    `https://api.basecamp.team/product/${id}`,
    `https://api.basecamp.team/package/${id}`,
    `https://api.basecamp.team/product-detail?id=${id}`
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: {
          'travel_agent_url': 'www.hdtourzone.com',
          'User-Agent': 'Mozilla/5.0'
        }
      });
      console.log(u, '=>', res.status);
      if (res.status === 200) {
        const data = await res.json();
        console.log('Success!', Object.keys(data));
        const fs = require('fs');
        fs.writeFileSync(`product_${id}.json`, JSON.stringify(data, null, 2));
        return data;
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}

testProductApi(64814);
