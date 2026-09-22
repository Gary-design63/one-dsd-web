import fs from 'node:fs';
const recovered = JSON.parse(fs.readFileSync('lib/content/community-design-data.json', 'utf8'));
const entries = [...recovered.map(({id,title})=>({id,title})), {id:'deaf-deafblind-hard-of-hearing',title:null}];
const results = [];
// Sequential requests keep the local preview usable on the owner's computer.
for (const entry of entries) {
  const response = await fetch(`http://127.0.0.1:3222/minnesota-communities/${entry.id}`);
  const body = await response.text();
  const heading = body.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1] ?? null;
  const item = {id:entry.id,status:response.status,heading,hasLearning:body.includes('Learning and reflection'),hasFullReading:body.includes('History, culture, and life today')};
  results.push(item);
  if (response.status !== 200 || !heading || !item.hasLearning || !item.hasFullReading) throw new Error(JSON.stringify(item));
}
fs.writeFileSync('evidence/community-design-route-check.json',JSON.stringify({checkedAt:new Date().toISOString(),base:'http://127.0.0.1:3222',count:results.length,results},null,2)+'\n');
console.log(`Verified ${results.length} local community pages: successful response, heading, full reading, and learning view.`);
