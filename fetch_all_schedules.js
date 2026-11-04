const fs = require('fs');

const items = [
  { id: 64814, imgFile: 'media_1793770731808_54a79ce1.png', badge: '로얄캐리비안, 페낭, 푸켓' },
  { id: 58840, imgFile: 'media_1793770743941_1b3c4393.png', badge: '싱가포르, 페낭, 네비게이터' },
  { id: 65143, imgFile: 'media_1793770763205_b3c5f14c.png', badge: '3개국, 겐팅드림, 바탐섬' },
  { id: 61741, imgFile: 'media_1793770787057_28605097.png', badge: '상하이, 제주도, 사세보' },
  { id: 61730, imgFile: 'media_1793770797725_0f948044.png', badge: '국내출발, 17만톤, 대형선박' },
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

    let scheduleList = [];
    if (product.schedule && product.schedule.json) {
      try {
        const parsed = JSON.parse(product.schedule.json);
        if (Array.isArray(parsed.schedule)) {
          scheduleList = parsed.schedule;
        } else if (parsed.schedule && typeof parsed.schedule === 'object') {
          scheduleList = Object.keys(parsed.schedule).sort((a,b)=>Number(a)-Number(b)).map(k => parsed.schedule[k]);
        }
      } catch (e) {
        console.error('Failed to parse schedule json for', item.id);
      }
    }

    const itemSummary = {
      id: item.id,
      title: masterInfo.title || tourInfo.title,
      badge: item.badge,
      imgFile: item.imgFile,
      price: masterInfo.min_adult_base_price,
      days: `${masterInfo.min_day}일 (${masterInfo.min_night}박)`,
      ship: tourInfo.cruise_name || '크루즈',
      description: masterInfo.short_description || masterInfo.og_description,
      schedules: scheduleList.map(day => ({
        day: day.day,
        title: day.title,
        hotel: day.hotel,
        meal: {
          breakfast: day.breakfast,
          lunch: day.lunch,
          dinner: day.dinner
        },
        spots: (day.schedule_detail_list || []).map(d => ({
          location: d.location,
          title: d.title,
          description: d.description ? d.description.replace(/<[^>]+>/g, '').trim().slice(0, 150) : ''
        }))
      }))
    };

    allData.push(itemSummary);
    console.log(`Fetched ${item.id}: ${itemSummary.title} (${itemSummary.days}) - ${itemSummary.schedules.length} days`);
  }

  fs.writeFileSync('all_5_schedules.json', JSON.stringify(allData, null, 2), 'utf-8');
  console.log('Saved all_5_schedules.json successfully!');
}

main().catch(console.error);
