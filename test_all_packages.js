async function main() {
  const ids = [58840, 65143, 58682, 61741, 61730, 61092, 56990, 56993, 62761, 56989, 54450];
  for (const id of ids) {
    const res = await fetch(`https://api.basecamp.team/package/${id}`, {
      headers: { 'travel_agent_url': 'www.hdtourzone.com', 'User-Agent': 'Mozilla/5.0' }
    });
    if (res.status === 200) {
      const data = await res.json();
      console.log(`ID ${id}: master_title=${data.master_title}, images=${data.image_list?.length}, ref_keys=${Object.keys(data.reference || {})}`);
      if (data.reference && Object.keys(data.reference).length > 0) {
        console.log(`--> ID ${id} HAS REFERENCE DATA!`);
        require('fs').writeFileSync(`package_${id}.json`, JSON.stringify(data, null, 2));
      }
    } else {
      console.log(`ID ${id} status: ${res.status}`);
    }
  }
}
main();
