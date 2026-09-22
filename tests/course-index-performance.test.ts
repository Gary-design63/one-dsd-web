import {writeEvidenceReceipt} from '@/tests/helpers/evidence-receipts';
import {it} from 'vitest';
import {loadPublishedEditableSurfaces} from '../lib/content/editable-surfaces';
import {programResourceDefinitions} from '../lib/intelligence/retrieval/program-resources';
import {indexedProgramResources} from '../lib/intelligence/retrieval/program-resources';
import {searchDocs} from '../lib/intelligence/retrieval/search';
it('profiles the cold published course index',async()=>{let t=performance.now(); const timings:Record<string,number>={};for(const kind of ['course.','community-reading.','other']){const started=performance.now();await loadPublishedEditableSurfaces(programResourceDefinitions().filter(d=>kind==='other'?!d.surfaceId.startsWith('course.')&&!d.surfaceId.startsWith('community-reading.'):d.surfaceId.startsWith(kind)).map(d=>d.surfaceId),'one-dhs');timings[kind]=performance.now()-started;}const publicationsMs=performance.now()-t;t=performance.now();const p=await indexedProgramResources('one-dhs');const indexMs=performance.now()-t;t=performance.now();searchDocs('What is two plus two?',p.destinations);writeEvidenceReceipt('evidence/next-pass-2026-09-08/course-index-timing.json',{timings,publicationsMs,indexMs,searchMs:performance.now()-t,documents:p.destinations.length});},30000);
