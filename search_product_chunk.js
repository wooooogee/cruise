const fs = require('fs');
const text = fs.readFileSync('product_chunk.js', 'utf-8');
const queries = ['getWithTravelAgent', 'product_id', 'fetch', 'axios', 'api'];
for (const q of queries) {
  let idx = 0;
  while ((idx = text.indexOf(q, idx)) !== -1) {
    console.log(`Found "${q}" at ${idx}:`, text.slice(Math.max(0, idx - 50), idx + 100));
    idx += q.length + 50;
    if (idx > 20000) break;
  }
}
