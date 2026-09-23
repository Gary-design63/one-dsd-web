/** Explicit maintenance build, outside the ordinary regression suite. No private database or questions. */
import { it,expect } from 'vitest';
import { writeFile,readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { indexedStaffDocs } from '@/lib/intelligence/retrieval/staff-search';
import { indexedProgramResources } from '@/lib/intelligence/retrieval/program-resources';
import { organizationalDocs } from '@/lib/intelligence/memory/organization';
import { prepareSemanticProjection } from '@/lib/intelligence/retrieval/local-semantic';
it('prepares the public document projection with actual local inference',async()=>{
 const one=[...await indexedStaffDocs('one-dhs'),...(await indexedProgramResources('one-dhs')).destinations];
 const dsd=[...await indexedStaffDocs('dsd'),...(await indexedProgramResources('dsd')).destinations];
 const started=Date.now();
 const result=await prepareSemanticProjection([...one,...dsd,...organizationalDocs()],(ready,total)=>console.log(`Prepared ${ready} of ${total} public document vectors.`));
 const bytes=JSON.stringify(result)+'\n';
 const name='public-document-vectors.json';
 await writeFile('models/bge-small-en-v1.5/'+name,bytes);
 const manifest=JSON.parse(await readFile('models/bge-small-en-v1.5/manifest.json','utf8'));
 manifest.vectorProjection={name,sha256:createHash('sha256').update(bytes).digest('hex'),documents:result.vectors.length};
 await writeFile('models/bge-small-en-v1.5/manifest.json',JSON.stringify(manifest,null,2)+'\n');
 await writeFile('evidence/functional-completion-2026-09-08/semantic-preparation.json',JSON.stringify({at:new Date().toISOString(),model:manifest.modelId,revision:manifest.revision,scope:'Current static public content in both views and organizational reference',oneDhsDocuments:one.length,dsdDocuments:dsd.length,vectors:result.vectors.length,elapsedMs:Date.now()-started,bytes:Buffer.byteLength(bytes),sha256:manifest.vectorProjection.sha256,privateDataRead:false,externalInferenceCalls:0},null,2));
 expect(result.vectors.length).toBeGreaterThan(1000);
});
