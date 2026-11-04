const endpoints = [
  '/product/package/64814',
  '/product/64814',
  '/package/64814',
  '/package/detail/64814',
  '/package/product/64814',
  '/product/detail/64814',
  '/common/package/64814',
  '/common/product/64814',
  '/package/info/64814',
  '/package/schedule/64814',
  '/travelagent/package/64814',
  '/search/product/64814',
  '/search/package/64814',
  '/master/64814'
];

async function testAll() {
  for (const ep of endpoints) {
    try {
      const res = await fetch('https://api.basecamp.team' + ep, {
        headers: {
          'travel_agent_url': 'www.hdtourzone.com',
          'User-Agent': 'Mozilla/5.0'
        }
      });
      console.log(ep, res.status);
      if (res.status === 200) {
        const d = await res.json();
        console.log('=> Response keys:', Object.keys(d));
      }
    } catch(e) {}
  }
}
testAll();
