import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import postgres from 'postgres';
const apply=process.argv.includes('--apply');
const production=process.argv.includes('--production');
const databaseUrl=process.env.PAC_DATABASE_URL;
if(!databaseUrl)throw new Error('Migration connection is required');
const local=['127.0.0.1','localhost'].includes(new URL(databaseUrl).hostname);
if(!local&&!production)throw new Error('Use explicit production mode for a remote database');
if(production&&process.env.PAC_DATA_ENV!=='production')throw new Error('Production data environment must be explicit');
const packs=JSON.parse(readFileSync('lib/content/courses/recovered.json','utf8'));
const migrations=['0036_pac_structured_course_publications.sql','0037_pac_course_schema_parameter.sql','0038_pac_course_validation_receipts.sql'];
const receipt={checkedAt:new Date().toISOString(),environment:local?'local':'production',applied:false,requestedApply:apply,sourceCourses:packs.length,migrations:migrations.map(name=>({name,sha256:createHash('sha256').update(readFileSync('db/migrations/'+name)).digest('hex').toUpperCase()})),publications:[],scopeChecks:[],failures:[]};
const sql=postgres(databaseUrl,{max:1,prepare:false,ssl:local?false:'require'});
try{
  if(!apply){console.log(JSON.stringify({mode:'check',courses:packs.length,migrations:receipt.migrations}));process.exitCode=0;}
  else{
    await sql`select pg_advisory_lock(hashtextextended('one-dhs-pac-schema-migrations',0))`;
    for (const file of migrations) {
    const text=readFileSync('db/migrations/'+file,'utf8');const hash=createHash('sha256').update(text).digest('hex').toUpperCase();
    const prior=await sql`select migration_sha256 from pac.schema_migrations where migration_name=${file}`;
    if(prior.length&&prior[0].migration_sha256.toUpperCase()!==hash)throw new Error('Applied migration differs; add a new migration');
    if(!prior.length){await sql.unsafe(text);await sql`insert into pac.schema_migrations(migration_name,migration_sha256,applied_by) values(${file},${hash},'owner-authorized-course-integration')`;}
    }
    const publishedThisTransaction=[];
    await sql.begin(async tx=>{
      for(const pack of packs){const id='course.'+pack.course.id;
        await tx`insert into pac.surface_definitions(surface_id,route_pattern,staff_label,scope_policy,field_contract,required_review_dimensions,registered_by) values(${id},${'/courses/'+pack.course.id},${pack.course.title},'inheritable',${tx.json([{key:'pack',label:'Course content',kind:'course-pack',required:true}])},${['language_alignment','factual_currentness','accessibility','scope','placement']},'owner-authorized-course-integration') on conflict(surface_id) do nothing`;
        const [{state}]=await tx`select pac.read_surface_editing_state('one-dhs',${id}) as state`;
        if(state.effective){if(!isDeepStrictEqual(state.effective.values?.pack??state.effective.document?.values?.pack,pack)){receipt.failures.push(id+' already has a different publication; preserved');continue;}publishedThisTransaction.push({surfaceId:id,action:'exact_replay'});continue;}
        if(state.latestDecision || state.expectedRevisionId){receipt.failures.push(id+' has owner history without an active publication; preserved');continue;}
        const document={schemaVersion:1,surfaceId:id,scope:'one-dhs',values:{pack}};
        const [{result}]=await tx`select pac.save_owner_approved_surface('one-dhs',${id},${state.expectedRevisionId??null}::uuid,${state.latestDecision?.publicationDecisionId??null}::bigint,${tx.json(document)},'Restore the complete owner-approved course and original interactions.') as result`;
        publishedThisTransaction.push({surfaceId:id,action:'published',revisionId:result.expectedRevisionId});
      }
    });
    receipt.publications=publishedThisTransaction;receipt.applied=true;
    for(const pack of packs)for(const scope of ['one-dhs','dsd']){
      const rows=await sql`select document,revision_id from pac.read_surface_publication(${scope},${'course.'+pack.course.id})`;
      const match=rows.length===1&&isDeepStrictEqual(rows[0].document.values.pack,pack);
      receipt.scopeChecks.push({course:pack.course.id,scope,exactPack:match,revisionId:rows[0]?.revision_id});
      if(!match)receipt.failures.push(pack.course.id+':'+scope+' does not match original');
    }
    // Replays must not undo a later owner removal from a learning theme.
    const newlyPublished = new Set(receipt.publications.filter(row=>row.action==='published').map(row=>'course-'+row.surfaceId.slice(7)));
    const memberships=JSON.parse(readFileSync('lib/content/courses/theme-memberships.json','utf8'));
    for(const scope of ['one-dhs','dsd']){
      const [{state}]=await sql`select pac.read_surface_editing_state(${scope},'learn.hub') as state`;
      if(!state.effective)continue;
      const values={...(state.effective.values??state.effective.document.values)};
      let changed=false;for(const [theme,ids]of Object.entries(memberships)){const key=theme+'Ids';const before=values[key]??[];values[key]=[...new Set([...before,...ids.filter(id=>newlyPublished.has(id))])];changed||=values[key].length!==before.length;}
      if(changed)await sql`select pac.save_owner_approved_surface(${scope},'learn.hub',${state.expectedRevisionId}::uuid,${state.latestDecision?.publicationDecisionId??null}::bigint,${sql.json({schemaVersion:1,surfaceId:'learn.hub',scope,values})},'Include the restored courses under their relevant learning themes.')`;
    }
    if(receipt.failures.length)process.exitCode=1;
  }
}catch(error){receipt.failures.push(error instanceof Error?error.message:'Course integration failed');process.exitCode=1;}
finally{await sql`select pg_advisory_unlock(hashtextextended('one-dhs-pac-schema-migrations',0))`.catch(()=>{});await sql.end();mkdirSync('evidence/next-pass-2026-09-08',{recursive:true});writeFileSync('evidence/next-pass-2026-09-08/'+(local?'local':'production')+'-course-publications.json',JSON.stringify(receipt,null,2));console.log(JSON.stringify({environment:receipt.environment,courses:receipt.publications.length,scopeChecks:receipt.scopeChecks.length,failures:receipt.failures}));}
