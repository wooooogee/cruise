const fs = require('fs');
const text = fs.readFileSync('product_chunk.js', 'utf-8');
const idx = text.indexOf('66481:function');
if (idx !== -1) {
  console.log(text.slice(idx, idx + 1500));
} else {
  console.log('Not found');
}
