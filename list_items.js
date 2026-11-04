const p = require('./products_86659.json');
p.product_list.forEach(item => {
  console.log(`[${item.id}] ${item.title} | badge: ${item.badge} | image: ${item.image}`);
});
