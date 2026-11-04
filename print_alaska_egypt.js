const data = require('./alaska_egypt_schedules.json');
for (const id in data) {
  const item = data[id];
  console.log('==================================================');
  console.log(`[ID: ${item.id}] ${item.title}`);
  console.log(`일정: ${item.daysText}`);
  item.daysSummary.forEach(d => {
    console.log(` Day ${d.day}: ${d.steps.slice(0, 3).join(' -> ')}`);
  });
}
