const p = require('./parsed_final_products.json');
p.forEach(prod => {
  console.log('--------------------------------------------------');
  console.log(`[${prod.id}] ${prod.title}`);
  console.log(`태그: ${prod.tag} | 일정: ${prod.daysText}`);
  prod.daysSummary.forEach(d => {
    console.log(` Day ${d.day}: ${d.steps.join(' -> ')}`);
  });
});
