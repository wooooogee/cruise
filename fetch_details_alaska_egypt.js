const fs = require('fs');

const ids = [56772, 64983, 56112];

async function main() {
  const results = {};
  for (const id of ids) {
    const url = `https://www.hdtourzone.com/_next/data/k00qfURfUYSqWXWcWv_By/master/${id}.json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await res.json();
    const props = json.pageProps || {};
    const masterInfo = props.masterInfo || {};
    const product = props.product || {};
    const tourInfo = product.tour_info || {};

    let scheduleData = {};
    if (product.schedule && product.schedule.json) {
      scheduleData = JSON.parse(product.schedule.json);
    }

    const daysSummary = [];
    const scheduleObj = scheduleData.schedule || {};
    const dayKeys = Object.keys(scheduleObj).sort((a,b)=>Number(a)-Number(b));

    for (const dKey of dayKeys) {
      const d = scheduleObj[dKey];
      const stepTitles = (d.steps || [])
        .map(st => {
          let t = st.title || '';
          if (st.short_comment) t += ` (${st.short_comment})`;
          return t;
        })
        .filter(Boolean);

      daysSummary.push({
        day: Number(dKey),
        hotel: d.hotel?.title || '',
        steps: stepTitles
      });
    }

    results[id] = {
      id,
      title: masterInfo.title || tourInfo.title,
      badge: masterInfo.badge,
      daysText: `${masterInfo.min_day}일 (${masterInfo.min_night}박)`,
      price: masterInfo.min_adult_base_price,
      daysSummary
    };
    console.log(`Fetched ${id}: ${results[id].title} (${results[id].daysText}) - ${daysSummary.length} days`);
  }

  fs.writeFileSync('alaska_egypt_schedules.json', JSON.stringify(results, null, 2), 'utf-8');
}

main().catch(console.error);
