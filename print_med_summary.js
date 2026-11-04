const all = require('./all_med_schedules.json');
all.forEach((item, i) => {
  console.log('==================================================');
  console.log(`[${i+1}] [ID: ${item.id}] ${item.title}`);
  console.log(`태그: ${item.badge} | 일정: ${item.daysText}`);
  item.daysSummary.forEach(d => {
    console.log(` Day ${d.day}: ${d.steps.slice(0, 3).join(' -> ')}`);
  });
});
