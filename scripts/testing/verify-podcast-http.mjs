import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const base = process.argv[2] ?? "http://127.0.0.1:3115";
if (!['127.0.0.1','localhost'].includes(new URL(base).hostname)) throw new Error("This verification is for a local application only.");
const receipt = { checkedAt: new Date().toISOString(), base, media: [], routes: [] };
for (const src of ['/audio/dhs-equity-policy-and-toolkit.mp3','/audio/anti-racism-public-service.mp3']) {
  const original = readFileSync(`public${src}`);
  const head = await fetch(`${base}${src}`, { method: 'HEAD' });
  assert.equal(head.status,200); assert.equal(Number(head.headers.get('content-length')),original.length); assert.match(head.headers.get('content-type'),/audio\/mpeg/);
  const ranges = [];
  for (const start of [0, Math.floor(original.length/2), original.length-1024]) {
    const end = start+1023;
    const response = await fetch(`${base}${src}`, { headers: { range: `bytes=${start}-${end}` } });
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(response.status,206); assert.equal(response.headers.get('content-range'),`bytes ${start}-${end}/${original.length}`); assert.equal(bytes.length,1024); assert.ok(bytes.equals(original.subarray(start,end+1)));
    ranges.push({ start,end,status:response.status,bytes:bytes.length,exactFileBytes:true });
  }
  const invalid = await fetch(`${base}${src}`, { headers: { range:`bytes=${original.length}-` } });
  assert.equal(invalid.status,416); await invalid.arrayBuffer();
  receipt.media.push({ src,bytes:original.length,contentType:head.headers.get('content-type'),headStatus:head.status,ranges,outOfRangeStatus:invalid.status });
}
for (const scope of ['one_dhs','one_dsd']) for (const [route,expected] of [
  ['/learn',2],['/learn/equity-toolkit',1],['/learn?theme=structural&type=podcast',2],['/learn?theme=culture&type=podcast',1],['/learn?theme=partnership&type=podcast',1],['/learn?theme=intercultural&type=podcast',0],['/learn?q=anti-racism&type=podcast',1],['/learn?type=learning_module',0],['/paths/gp-1',0]
]) {
  const response = await fetch(`${base}${route}`, {headers:{cookie:`pac_context=${scope}`}});
  const html=await response.text();
  const players=(html.match(/<audio /g)??[]).length;
  assert.equal(response.status,200,`${scope} ${route}`); assert.equal(players,expected,`${scope} ${route}`);
  receipt.routes.push({ scope,route,status:response.status,players,passed:true });
}
writeFileSync('evidence/local-audit-2026-09-07/podcast-http-verification.json',JSON.stringify(receipt,null,2));
console.log(JSON.stringify({media:receipt.media.length,rangeChecks:receipt.media.reduce((n,m)=>n+m.ranges.length,0),routes:receipt.routes.length,passed:true}));
