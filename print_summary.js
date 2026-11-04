const all = require('./all_5_schedules.json');
all.forEach((item, i) => {
  console.log(`\n=== [${i+1}] ${item.title} (ID: ${item.id}) ===`);
  console.log(`뱃지: ${item.badge} | 기간: ${item.days} | 선박: ${item.ship}`);
  item.schedules.forEach(s => {
    console.log(`  Day ${s.day}: ${s.title || '(무제)'} | 호텔: ${s.hotel || '-'}`);
    s.spots.forEach(sp => {
      console.log(`     - [${sp.location}] ${sp.title}`);
    });
  });
});
