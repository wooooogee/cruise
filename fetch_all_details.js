const fs = require('fs');

const productIds = [64814, 58840, 65143, 61741, 61730];

async function fetchAll() {
  const results = {};
  for (const id of productIds) {
    const res = await fetch(`https://api.basecamp.team/package/${id}`, {
      headers: {
        'travel_agent_url': 'www.hdtourzone.com',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const data = await res.json();
    fs.writeFileSync(`product_${id}.json`, JSON.stringify(data, null, 2));

    const ref = data.reference || {};
    results[id] = {
      id,
      title: data.master_title || ref.title,
      period: ref.period || ref.tour_period,
      ship_name: ref.ship_name || ref.cruise_name,
      flight: ref.flight,
      schedule: (ref.schedule_list || []).map(s => ({
        day: s.day,
        title: s.title,
        city: s.city,
        content: s.content,
        hotel: s.hotel,
        meal: s.meal,
        detail_schedule: (s.detail_schedule_list || []).map(d => ({
          time: d.time,
          title: d.title,
          content: d.content
        }))
      }))
    };
    console.log(`Fetched ${id}: ${results[id].title}`);
  }
  fs.writeFileSync('all_5_products.json', JSON.stringify(results, null, 2), 'utf-8');
}

fetchAll().catch(console.error);
