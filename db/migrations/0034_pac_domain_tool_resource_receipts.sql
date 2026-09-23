-- The restored resource collection includes tool-* canonical IDs. Preserve
-- all audit/work-object rules while extending only that resource namespace.
begin;
do $$
declare target regprocedure; definition text;
begin
 foreach target in array array[
  'pac.assert_runtime_audit_event_contract(jsonb)'::regprocedure,
  'pac.assert_runtime_work_object_contract(text,text,jsonb)'::regprocedure
 ] loop
  definition := pg_get_functiondef(target);
  if position('pn|ja|lm|ext|asset' in definition)=0 then
   raise exception 'Expected canonical resource namespace is missing from %',target;
  end if;
  if position('pn|ja|lm|ext|asset|tool' in definition)>0 then
   raise exception 'Domain tool namespace is already present in %; verify the migration ledger',target;
  end if;
  execute replace(definition,'pn|ja|lm|ext|asset','pn|ja|lm|ext|asset|tool');
 end loop;
end;
$$;
commit;
