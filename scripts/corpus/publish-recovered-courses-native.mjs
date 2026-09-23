import {readFileSync,writeFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
const url=new URL(process.env.PAC_DATABASE_URL??'');
const local=['localhost','127.0.0.1'].includes(url.hostname);
if(!local&&(!process.argv.includes('--production')||process.env.PAC_DATA_ENV!=='production'))throw new Error('Production mode must be explicit');
if(!process.argv.includes('--apply'))throw new Error('Apply must be explicit');
const packs=JSON.parse(readFileSync('lib/content/courses/recovered.json','utf8'));
const memberships=JSON.parse(readFileSync('lib/content/courses/theme-memberships.json','utf8'));
const literal=(value)=>{const text=JSON.stringify(value);if(text.includes('$pac_import_json$'))throw new Error('Reserved source delimiter');return '$pac_import_json$'+text+'$pac_import_json$::jsonb';};
const query=`\\set ON_ERROR_STOP on
begin;
set local statement_timeout='180s';
select pg_advisory_xact_lock(hashtextextended('one-dhs-pac-course-publications',0));
do $pac_import$
declare pack jsonb; item jsonb; current_state jsonb; current_pack jsonb; surface text; scope text; source_document jsonb; hub_values jsonb; theme text; ids jsonb; old_ids jsonb; next_ids jsonb; id jsonb; changed boolean; added jsonb := '[]';
begin
 if not exists(select 1 from pac.schema_migrations where migration_name='0038_pac_course_validation_receipts.sql') then raise exception 'Required additive course migrations are missing'; end if;
 for pack in select value from jsonb_array_elements(${literal(packs)}) loop
  surface := 'course.'||(pack #>> '{course,id}');
  insert into pac.surface_definitions(surface_id,route_pattern,staff_label,scope_policy,field_contract,required_review_dimensions,registered_by)
   values(surface,'/courses/'||(pack #>> '{course,id}'),pack #>> '{course,title}','inheritable','[{"key":"pack","label":"Course content","kind":"course-pack","required":true}]','{language_alignment,factual_currentness,accessibility,scope,placement}','owner-authorized-course-integration') on conflict(surface_id) do nothing;
  current_state := pac.read_surface_editing_state('one-dhs',surface);
  current_pack := coalesce(current_state #> '{effective,values,pack}',current_state #> '{effective,document,values,pack}');
  if current_pack is not null then
   if current_pack <> pack then raise exception 'Existing owner course differs; preserved: %',surface; end if;
  else
   if current_state->>'expectedRevisionId' is not null or current_state->>'latestDecision' is not null then raise exception 'Existing owner course history preserved: %',surface; end if;
   source_document := jsonb_build_object('schemaVersion',1,'surfaceId',surface,'scope','one-dhs','values',jsonb_build_object('pack',pack));
   perform pac.save_owner_approved_surface('one-dhs',surface,null,null,source_document,'Restore the complete owner-approved course and original interactions.');
   added := added || jsonb_build_array('course-'||(pack #>> '{course,id}'));
  end if;
  foreach scope in array array['one-dhs','dsd'] loop
   select document->'values'->'pack' into current_pack from pac.read_surface_publication(scope,surface);
   if current_pack is distinct from pack then raise exception 'Scoped publication mismatch: % %',surface,scope; end if;
  end loop;
 end loop;
 foreach scope in array array['one-dhs','dsd'] loop
  current_state := pac.read_surface_editing_state(scope,'learn.hub');
  hub_values := coalesce(current_state #> '{effective,values}',current_state #> '{effective,document,values}');
  if hub_values is not null then
   changed := false;
   for theme,ids in select key,value from jsonb_each(${literal(memberships)}) loop
    old_ids := coalesce(hub_values->(theme||'Ids'),'[]');next_ids := old_ids;
    for id in select value from jsonb_array_elements(ids) loop
     if added @> jsonb_build_array(id) and not next_ids @> jsonb_build_array(id) then next_ids := next_ids || jsonb_build_array(id);end if;
    end loop;
    changed := changed or next_ids <> old_ids;hub_values := jsonb_set(hub_values,array[theme||'Ids'],next_ids);
   end loop;
   if changed then perform pac.save_owner_approved_surface(scope,'learn.hub',(current_state->>'expectedRevisionId')::uuid,(current_state #>> '{latestDecision,publicationDecisionId}')::bigint,jsonb_build_object('schemaVersion',1,'surfaceId','learn.hub','scope',scope,'values',hub_values),'Include the restored courses under their relevant learning themes.');end if;
  end if;
 end loop;
end;
$pac_import$;
commit;
select jsonb_build_object('publishedCourses',(select count(*) from pac.surface_definitions where surface_id like 'course.%'),'scopeChecks',(select jsonb_agg(jsonb_build_object('course',pack #>> '{course,id}','scope',scope,'exactPack',p.document->'values'->'pack'=pack,'revisionId',p.revision_id)) from jsonb_array_elements(${literal(packs)}) as source(pack) cross join unnest(array['one-dhs','dsd']) as s(scope) left join lateral pac.read_surface_publication(scope,'course.'||(pack #>> '{course,id}')) p on true));
`;
const startedAt=new Date().toISOString();
const environment={...process.env,PGHOST:url.hostname,PGPORT:url.port||'5432',PGDATABASE:decodeURIComponent(url.pathname.slice(1)),PGUSER:decodeURIComponent(url.username),PGPASSWORD:decodeURIComponent(url.password),PGSSLMODE:local?'disable':'require',PGCONNECT_TIMEOUT:'20'};
const clientArgument=process.argv.indexOf('--psql');
const executable=clientArgument<0?'psql':process.argv[clientArgument+1];
const child=spawn(executable,['-X','-At','-v','ON_ERROR_STOP=1'],{env:environment,windowsHide:true,stdio:['pipe','pipe','pipe']});let output='',errors='';child.stdout.on('data',b=>output+=b);child.stderr.on('data',b=>errors+=b);child.stdin.on('error',()=>{});child.stdin.end(query);
const code=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('exit',resolve);});
const line=output.trim().split(/\r?\n/).findLast(line=>line.startsWith('{'));const result=line?JSON.parse(line):{};
const receipt={startedAt,completedAt:new Date().toISOString(),environment:local?'local':'production',transport:'Native PostgreSQL client',sourceCourses:packs.length,transactionCommitted:code===0,...result,failures:code===0?[]:errors.split(/\r?\n/).filter(line=>/ERROR:|FATAL:/.test(line)).map(line=>line.slice(0,300))};
if(code===0&&(result.scopeChecks?.length!==172||result.scopeChecks.some(row=>row.exactPack!==true)))receipt.failures.push('Post-commit exact scoped verification failed');
if(code!==0&&!receipt.failures.length)receipt.failures.push('Native client failed with exit '+code);
writeFileSync('evidence/next-pass-2026-09-08/'+(local?'local':'production')+'-course-publications-native.json',JSON.stringify(receipt,null,2));
console.log(JSON.stringify({committed:receipt.transactionCommitted,courses:result.publishedCourses,scopeChecks:result.scopeChecks?.length,failures:receipt.failures}));process.exitCode=receipt.failures.length?1:0;
