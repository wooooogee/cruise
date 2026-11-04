const fs = require('fs');

const items = [
  { id: 64814, file: 'master_64814.json', img: 'media_1793770731808_54a79ce1.png', tag: '로얄캐리비안, 페낭, 푸켓' },
  { id: 58840, file: 'master_58840.json', img: 'media_1793770743941_1b3c4393.png', tag: '싱가포르, 페낭, 네비게이터' },
  { id: 65143, file: 'master_65143.json', img: 'media_1793770763205_b3c5f14c.png', tag: '3개국, 겐팅드림, 바탐섬' },
  { id: 61741, file: 'master_61741.json', img: 'media_1793770787057_28605097.png', tag: '상하이, 제주도, 사세보' },
  { id: 61730, file: 'master_61730.json', img: 'media_1793770797725_0f948044.png', tag: '국내출발, 17만톤, 대형선박' }
];

async function run() {
  const finalProducts = [];

  for (const item of items) {
    let json;
    const url = `https://www.hdtourzone.com/_next/data/k00qfURfUYSqWXWcWv_By/master/${item.id}.json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    json = await res.json();

    const props = json.pageProps || {};
    const masterInfo = props.masterInfo || {};
    const product = props.product || {};
    const tourInfo = product.tour_info || {};

    let scheduleData = {};
    if (product.schedule?.json) {
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

      const hotelName = d.hotel?.title || '';
      const cruisePort = d.cruise?.port_name || d.cruise?.title || '';

      daysSummary.push({
        day: Number(dKey),
        hotel: hotelName,
        cruise: cruisePort,
        steps: stepTitles
      });
    }

    finalProducts.push({
      id: item.id,
      title: masterInfo.title || tourInfo.title,
      tag: item.tag,
      img: item.img,
      daysText: `${masterInfo.min_day}일 (${masterInfo.min_night}박)`,
      price: masterInfo.min_adult_base_price,
      daysSummary
    });
  }

  fs.writeFileSync('parsed_final_products.json', JSON.stringify(finalProducts, null, 2), 'utf-8');
  console.log('Saved parsed_final_products.json');
}

run().catch(console.error);
