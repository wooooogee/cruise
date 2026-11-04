const fs = require('fs');

const items = [
  { id: 65676, img: 'img/med-toscana.png', badge: '로마, 마요르카, 바르셀로나' },
  { id: 63446, img: 'img/med-ncl-dawn.png', badge: '지중해+대서양, NCL, 동굴투어' },
  { id: 58874, img: 'img/med-world-asia-1.png', badge: '최신선박, 4개국, 몰타' },
  { id: 59591, img: 'img/med-world-asia-2.png', badge: '럭셔리, 4개국, 최선선박' },
  { id: 65203, img: 'img/med-world-asia-3.png', badge: '로마, 월드아시아, 최신선박' }
];

async function main() {
  const allData = [];

  for (const item of items) {
    const url = `https://www.hdtourzone.com/_next/data/k00qfURfUYSqWXWcWv_By/master/${item.id}.json`;
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

    const summary = {
      id: item.id,
      title: masterInfo.title || tourInfo.title,
      badge: item.badge,
      img: item.img,
      daysText: `${masterInfo.min_day}일 (${masterInfo.min_night}박)`,
      price: masterInfo.min_adult_base_price,
      daysSummary
    };

    allData.push(summary);
    console.log(`Fetched ${item.id}: ${summary.title} (${summary.daysText}) - ${summary.daysSummary.length} days`);
  }

  fs.writeFileSync('all_med_schedules.json', JSON.stringify(allData, null, 2), 'utf-8');
  console.log('Saved all_med_schedules.json');
}

main().catch(console.error);
