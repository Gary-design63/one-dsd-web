-- Admit a second public research service to the existing bounded policy/usage contracts.
-- Preserve every other check, all privileges, and existing records.
do $migration$
declare prior text; revised text;
begin
  select pg_get_functiondef('pac.assert_runtime_work_object_contract(text,text,jsonb)'::regprocedure) into prior;
  revised := replace(prior, '''perplexity_agent'', ''fixture''', '''perplexity_agent'', ''openai_web'', ''fixture''');
  if revised = prior then raise exception 'Research provider contract anchor was not found'; end if;
  execute revised;
end;
$migration$;
