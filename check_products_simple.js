const p = require('./products_86659.json');
console.log(JSON.stringify(p.product_list.map(x => ({
  id: x.id,
  title: x.title,
  badge: x.badge,
  min_price: x.min_price,
  image: x.image,
  brief: x.brief_route_description
})), null, 2));
