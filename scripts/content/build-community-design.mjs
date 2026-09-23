import fs from 'node:fs';
const source='data/source-snapshots/donor-library/community-candidates.jsonl';
const rows=fs.readFileSync(source,'utf8').trim().split(/\r?\n/).map(JSON.parse);
const aliases={black:'african-american',tribal:'tribal-nations',russian:'russian-speaking',arabic:'arabic-speaking',cambodian:'khmer'};
const omitted=[];
const communities=rows.filter(r=>r.assetKind==='community_brief'||r.assetKind==='community_brief_unmatched_guide').map(r=>{
 const guide=r.richOriginal.intelligenceGuide;
 const chapters=(guide?.chapters||[]).map(c=>({heading:c.title,body:c.body}));
 if(!chapters.length)throw new Error('Missing full chapters: '+r.assetId);
 const sections=chapters.map(c=>({heading:c.heading,body:c.body.split(/\n\s*\n/).filter(p=>{
   // Internal production commentary is retained in the source and recorded here,
   // not presented as community knowledge in the design preview.
   const internal=/Nothing from the consultant|living candidate|staff keep a stable doorway|Wikipedia lines|ERGs inside DHS are a verification|This copy is|promote.*administration/i.test(p);
   if(internal)omitted.push({id:r.assetId,heading:c.heading,text:p});
   return !internal;
 }).join('\n\n')})).filter(c=>c.body);
 const titles={black:'African American Minnesota','native-american':'Native American Minnesotans',lao:'Lao Minnesota','european-american':'European American Minnesota'};
 return {id:aliases[r.assetId]||r.assetId,sourceId:r.assetId,title:titles[r.assetId]||r.title,sections};
});
fs.writeFileSync('lib/content/community-design-data.json',JSON.stringify(communities,null,2)+'\n');
fs.writeFileSync('evidence/community-design-accounting.json',JSON.stringify({source,communityCount:communities.length,canonicalCommunityBriefs:40,additionalPopulationGuide:1,communities:communities.map(c=>({id:c.id,sourceId:c.sourceId,chapters:c.sections.length,characters:c.sections.reduce((n,s)=>n+s.body.length,0)})),otherResources:rows.filter(r=>!communities.some(c=>c.sourceId===r.assetId)).map(r=>({id:r.assetId,kind:r.assetKind,title:r.title})),internalParagraphsExcludedFromPreview:omitted},null,2)+'\n');
console.log(JSON.stringify({communities:communities.length,chapters:communities.reduce((n,c)=>n+c.sections.length,0),internalParagraphs:omitted.length}));
