const p = require('./product_64814.json');
console.log('Top keys:', Object.keys(p));
console.log('master_title:', p.master_title);
console.log('reference keys:', p.reference ? Object.keys(p.reference) : 'none');
if (p.reference) {
  console.log('ref title:', p.reference.name || p.reference.title || p.reference.product_name);
  console.log('ref schedule_list length:', p.reference.schedule_list?.length);
  if (p.reference.schedule_list?.[0]) {
    console.log('schedule[0] keys:', Object.keys(p.reference.schedule_list[0]));
    console.log('schedule[0]:', JSON.stringify(p.reference.schedule_list[0], null, 2).slice(0, 500));
  }
}
