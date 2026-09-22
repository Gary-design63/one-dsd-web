import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root = process.cwd();
const output = 'C:/Users/garyb/Documents/Codex/2026-09-09/realtime-voice-chat/outputs';
const map = JSON.parse(fs.readFileSync(path.join(output, 'RESOURCE-MAP-EXISTING-EVIDENCE.json'), 'utf8'));
const evidence = 'evidence/multimedia-review-2026-09-09';
const component = name => 'components/multimedia/' + name + '.tsx';
const referenceIds = new Set(['purpose','structure','dsd-placement','county-tribal','assessment','person-centered','employment','licensing','transitions','language-access','operations','behavioral-health','mhcp','housing','legislative']);
const stageIds = new Set(['recruit','interview','everyday','develop','advance','retain','succession']);
const specials = {
 'amplify-gatherings':['engagement-worked-examples','Selected activity disclosures contain actual fictional examples and a source-attributed Minnesota photograph.'],
 'amplify-mentoring':['engagement-worked-examples','Mentoring/sponsorship conversation comparison; no recorded dialogue claimed.'],
 'amplify-well-being':['engagement-worked-examples','Working-condition comparison distinguishes personal breaks from changes in work.'],
 'amplify-ideas':['engagement-worked-examples','A completed fictional idea brief remains separate from the contributor form.'],
 'amplify-co-leads':['engagement-worked-examples','Written pause-and-repair conversation, with an optional facilitation cue.'],
 'amplify-materials':['engagement-worked-examples','Fictional question/update examples accompany the original templates.'],
 'dsd-team':['engagement-contribution-map','A fictional handoff is mapped through contribution, decision authority and return; a full work note is available.'],
 'dsd-learning-lab':['engagement-worked-examples','Written fictional meeting conversation plus exact facilitation prompts; no video claimed.'],
 'leadership-development-map':['dsd-development-map-example','Capability-specific completed examples stay separate from the personal development form.'],
 'leadership-continuity-plan':['dsd-development-map-example','Fictional handover/readiness example accompanies the unchanged continuity planner; no recorded walkthrough claimed.'],
 'orientation-directory':['engagement-route-map','Expandable linked route map uses the existing orientation destinations.'],
 'dsd-inventory-map':['dsd-inventory-map','Each visible program is connected to its exact work question; only supplied scoped published profiles appear.'],
 'amplify-activity-minnesota':['engagement-worked-examples','Authentic NPS/Gordon Dietzman photograph at Minnehaha Falls Regional Park, explicit public-domain metadata, alt text and source/history links.'],
 'amplify-activity-borrow':['engagement-worked-examples','Two fictional handoff notes demonstrate a transferable change.'],
 'amplify-activity-question':['engagement-worked-examples','Two work perspectives on the same handoff question.'],
 'amplify-activity-window':['engagement-worked-examples','Written process walkthrough; no captioned video claimed.'],
 'amplify-activity-friction':['engagement-worked-examples','Fictional completed brief complements existing idea tool.'],
};
function dsd(row) {
 const id = row.recordKey.slice(4);
 if (id === 'erg-connections') return ['awaiting-contributor',[], 'Original optional connection cards retained. The proposed chosen contributor recording requires an actual willing contribution and attribution; none is supplied.'];
 if (id === 'scenario-dsd-interpreter-first-contact') return ['integrated',[component('dsd-first-contact-audio'),component('dsd-scenario-media')], 'Two actual synthetic narrated English examples compare an English-only dead end with a supported first-contact arrangement. Native controls, complete matching transcripts and failure fallback; no translation or live service claimed. Provenance: additional-audio-provenance.json. Perceptual listening remains separate from waveform checks.'];
 if (id.startsWith('dsd-program-')) return ['integrated',[component('dsd-program-media'),component('dsd-work-examples')], 'Resource-specific HTML worked example, comparison or native data/document demonstration after equity entry points. Proposed illustration/video is delivered as a text-equivalent native companion where applicable; not claimed as a recording.'];
 if (id.startsWith('scenario-')) return ['integrated',[component('dsd-scenario-media'),component('dsd-work-examples'),component('dsd-access-demonstrations')], 'Exact fictional scenario companion after the situation. Accessible-form and service-redesign include working demonstrations; policy-change/data use native interactive views. Other scenes are written comparisons/process diagrams, not recorded replays.'];
 if (id.startsWith('leadership-stage-')) return stageIds.has(id.slice(17)) ? ['integrated',[component('dsd-leadership-media')], 'An exact stage companion is integrated between the original situation and practice; original reflection/export remains intact. Written/table/flow media is delivered, not a captioned recording.'] : ['retained',[row.source], 'Original stage teaching, situation, actionable practice, related destination and reflection/export already provide the requested activity. Reuse avoids repeating this teaching in another diagram.'];
 if (id.startsWith('dhs-reference-')) return referenceIds.has(id.slice(14)) ? ['integrated',[component('engagement-reference-map')], 'Exact relationship comparison table sits in this reference card between its facts and original partners/source links; complete HTML text carries the meaning.'] : ['retained',[row.source], 'Retained the exact dated source-linked reference card: ' + row.basis + ' A static replacement diagram could age separately from the source; the original navigation and context serve this purpose.'];
 if (specials[id]) return ['integrated',[component(specials[id][0])],specials[id][1]];
 return ['retained',[row.source], 'Retained the exact original activity and its optional choices: ' + row.basis + ' Participant-chosen material is not replaced by an invented contribution.'];
}
const programComponents = {
 'toolkit-companion':['engagement-toolkit-route','Working two-route reminder comparison; original toolkit choices and drafting controls remain intact.'],
 'community-learning':['engagement-learning-scenes','Four-part native HTML sequence follows one stated barrier through influence, evidence and report-back; not a representational illustration.'],
 'operational-equity-meeting':['worked-practice-examples','Three described meeting moments show preparation, participation and report-back.'],
 'operational-equity-form':['worked-practice-examples','Complete-task comparison table traces burdens and alternatives.'],
 'operational-equity-opportunity':['opportunity-pathway','Native opportunity pathway maps discovery, participation and decision.'],
 'about-dhs':['worked-practice-examples','Linked knowledge/practice/support relationship map.'],
 'library-directory':['resource-media-preview','Resource-specific previews appear only inside already-visible results.'],
 'my-work-explore':['resource-media-preview','Plain-language worked notice preview appears only when its course is available.'],
 'my-work-reflect':['worked-practice-examples','Fictional before/during/after reflection example; no comparison or copying of personal saved artifacts.'],
 'support-right-person':['worked-practice-examples','Three questions about one reminder map to distinct responsible functions.'],
 'support-result':['worked-practice-examples','Fictional outcome record separates changed work, observations, uncertainty and next action before the existing form.'],
};
function program(row) {
 const id = row.recordKey.slice(8);
 if (id.startsWith('journey-')) return ['integrated',[component('engagement-learning-scenes')], id === 'journey-perspectives' ? 'Photorealistic paired fictional meeting still and an exact evidence/influence comparison; original example and notebook remain intact.' : 'Exact conversation/process/evidence table expands this focus immediately before its original practice. Full described text, not generated people images.'];
 if (id.startsWith('podcast-')) return ['integrated',['components/published-podcast.tsx','components/podcast-player.tsx','lib/content/podcast-supplements.ts'], 'Existing original audio retained with actual recording-derived draft transcript, passage search, timestamp seek and reviewed chapter topics: 9 toolkit chapters, 11 anti-racism chapters. Root browser reviewed actual search/seek/playback. Machine transcript fidelity remains qualified; not a certified or official transcript.'];
 if (id === 'ask-media') return ['integrated',[component('resource-media-preview'),'components/ask-client.tsx','lib/intelligence/retrieval/podcast-reading.ts'], 'Three exact companion previews and two exact podcast-anchor reading/playback previews support already-visible cited resources. Both actual draft podcast transcripts enrich only current scoped published podcast rows; no extra destinations, no private notes and no global full-corpus transcript claim. Nine discovery tests plus exact media-preview tests pass; source-scope and withdrawal behavior retained.'];
 if (programComponents[id]) return ['integrated',[component(programComponents[id][0])],programComponents[id][1]];
 return ['retained',[row.source], 'Retained the existing functional entry and original media: ' + row.basis + ' The current destination supplies the detailed activity without duplicating it in entry navigation.'];
}
function build(rows, resolve) {
 return rows.map(row => {
  const [state, files, delivered] = resolve(row);
  for (const file of files) if (!fs.existsSync(path.join(root,file))) throw new Error('Missing evidence file: '+file);
  return { recordKey: row.recordKey, title: row.title, route: row.route, placement: row.placement, purpose: row.purpose,
   proposedMedia: row.media, deliveredMediaAndDecision: delivered, state,
   source: row.source, sourceBasis: row.basis, implementationFiles: files,
   accessibility: 'Native headings, lists, tables or field labels provide the content; image descriptions and source links accompany photos. No autoplay. Original learning notes and form data remain separate.',
   checks: { implementationFilesExist: true, behavioralSuite: '107 passing tests across DSD, engagement, exact media previews, library continuity and toolkit boundaries; not every row is independently behavior-tested', browser: 'See root browser receipt; no blanket browser verification claimed here' },
   remaining: state === 'partial' || state === 'awaiting-contributor' ? delivered : 'Any suggested recording not delivered above remains an alternative medium, not a completed recording.' };
 });
}
fs.mkdirSync(path.join(root,evidence),{recursive:true});
for (const [name,prefix,resolve] of [['dsd-media-status','dsd:',dsd],['engagement-media-status','program:',program]]) {
 const records = build(map.filter(row=>row.recordKey.startsWith(prefix)), resolve);
 const counts = records.reduce((acc,row)=>(acc[row.state]=(acc[row.state]||0)+1,acc),{});
 const result = { updatedAt: new Date().toISOString(), scope: 'Saved recommendation rows only; not an all-course/all-chapter census.', totalRecords: records.length, counts, records };
 fs.writeFileSync(path.join(root,evidence,name+'.json'),JSON.stringify(result,null,2)+'\n');
 fs.writeFileSync(path.join(output,name+'.json'),JSON.stringify(result,null,2)+'\n');
 console.log(name,JSON.stringify(counts),records.length);
}
const photo = 'public/images/media-minnehaha-nps-dietzman.jpg';
const provenance = { asset:photo, sha256:crypto.createHash('sha256').update(fs.readFileSync(photo)).digest('hex'), dimensions:[1000,666], creditedPhotographer:'NPS/Gordon Dietzman', source:'https://npgallery.nps.gov/AssetDetail/6D680AA3-1DD8-B71B-0B4788AB317C0219', originalDownload:'https://npgallery.nps.gov/GetAsset/6D680AA3-1DD8-B71B-0B4788AB317C0219/proxyhires.jpg', rights:'Source metadata explicitly says Public domain:Full Granting Rights', sourceLocation:'Minnehaha Falls Regional Park', embeddedTimestamp:'2016-09-09', retrieved:'2026-09-09', alteration:'None; retained source image bytes', actualUse:'dsd:amplify-activity-minnesota', visualReview:'Viewed locally: stream beneath low stone bridge, rocks and wooded banks match description. No people, no fabricated historical reconstruction.', relatedReading:'https://www.minneapolisparks.org/parks-destinations/parks-lakes/minnehaha_regional_park/' };
fs.writeFileSync(path.join(root,evidence,'minnehaha-media-provenance.json'),JSON.stringify(provenance,null,2)+'\n');

