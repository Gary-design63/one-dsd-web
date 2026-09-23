import { describe,it,expect,beforeAll } from 'vitest';
import { localSemanticRetrieve,semanticDocumentKey } from '@/lib/intelligence/retrieval/local-semantic';
import { searchDocs,type Doc } from '@/lib/intelligence/retrieval/search';
const make = (id:string,title:string,summary:string,scope='agencywide'):Doc => ({kind:'content',id,title,summary,text:title+' '+summary,scope,href:'/library/'+id,authority:'guidance',type:'guidance',status:'approved',reviewDate:'2026-09-08',tags:[],intents:[]});
const docs=[
make('hiring','Structured interviewing','Assess candidates consistently against job-related criteria. Record evidence for ratings and discuss assumptions about eye contact or communication styles.'),
make('access','Accessible meetings','Provide captions, agendas in advance, multiple ways to contribute, and readable materials so colleagues can participate.'),
make('retention','Stay interviews and career development','Understand why people remain, remove barriers to advancement, and offer mentoring and stretch assignments before staff leave.'),
make('language','Interpreting and translation','Provide language assistance for people who need information in another language.'),
make('procurement','Equity in contracting','Examine vendor selection, solicitation requirements, and barriers for small suppliers.'),
];
describe('real local semantic retrieval',()=>{
  beforeAll(async()=>{await localSemanticRetrieve('How can colleagues participate in a meeting?',[],docs);},15000);
  it.each([
    ['The applicant avoided looking directly at me. Is that evidence of poor ability?','hiring'],
    ['Coworkers cannot hear the presentation or read the slides.','access'],
    ['People quit because they cannot see a future here.','retention'],
    ['A family cannot understand our English letters.','language'],
    ['Our purchasing rules make it difficult for smaller businesses to bid.','procurement'],
  ])('matches meaning for %s',async(query,id)=>{
    expect((await localSemanticRetrieve(query,[],docs))[0]?.id).toBe(id);
  });
  it('finds a paraphrase with no meaningful keyword overlap',async()=>{
    const candidate=make('retention','Employee retention','Keeping workers from resigning.');
    const query='How do we reduce staff turnover?';
    expect(searchDocs(query,[candidate])).toEqual([]);
    expect((await localSemanticRetrieve(query,[],[candidate]))[0]?.id).toBe('retention');
  });
  it('does not cite unrelated program material for an unrelated topic',async()=>{
    expect(await localSemanticRetrieve('How far is Jupiter from the Sun?',[],docs)).toEqual([]);
  });
  it('rechecks the eligible snapshot after the vector cache is populated',async()=>{
    await localSemanticRetrieve('Offer mentoring to reduce turnover',[],docs);
    expect(await localSemanticRetrieve('Offer mentoring to reduce turnover',[],[])).toEqual([]);
    const current=make('retention','Other material','A recipe for vegetable soup.','dsd');
    expect(semanticDocumentKey(current)).not.toBe(semanticDocumentKey(docs[2]));
    expect(await localSemanticRetrieve('Offer mentoring to reduce turnover',[],[current])).toEqual([]);
  });
  it('never returns cached documents from another requested scope',async()=>{
    const one=make('division-only','Mentoring for staff','Career growth through coaching and sponsorship.','dsd');
    await localSemanticRetrieve('Help people develop their careers',[],[one]);
    const current=docs.filter(d=>d.id==='procurement');
    expect((await localSemanticRetrieve('Help people develop their careers',[],current)).some(h=>h.id==='division-only')).toBe(false);
  });
});
