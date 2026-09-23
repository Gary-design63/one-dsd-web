-- Forward-only seed for the new toolkit companion. Requires migration 0018.
-- No existing definitions or append-only history are overwritten. Exact replay
-- preserves subsequent consultant revisions, withdrawals, and scoped publications.
-- This migration does not change runtime feature flags or official DHS systems.
begin;

do $pac_seed$
declare
  registry_seed constant jsonb := $pac_registry$[{"surfaceId":"equity-toolkit.home","routePattern":"/learn/equity-toolkit","staffLabel":"Equity Analysis Toolkit companion","scopePolicy":"inheritable","fieldContract":[{"key":"title","label":"title","kind":"long","required":true},{"key":"intro","label":"intro","kind":"long","required":true},{"key":"companionNote","label":"companionNote","kind":"long","required":true},{"key":"roleLabel","label":"roleLabel","kind":"long","required":true},{"key":"roleIntro","label":"roleIntro","kind":"long","required":true},{"key":"noRoleLabel","label":"noRoleLabel","kind":"long","required":true},{"key":"stageNavLabel","label":"stageNavLabel","kind":"long","required":true},{"key":"objectivesTitle","label":"objectivesTitle","kind":"long","required":true},{"key":"scenarioTitle","label":"scenarioTitle","kind":"long","required":true},{"key":"consequenceTitle","label":"consequenceTitle","kind":"long","required":true},{"key":"practiceLabel","label":"practiceLabel","kind":"long","required":true},{"key":"workLabel","label":"workLabel","kind":"long","required":true},{"key":"draftTitle","label":"draftTitle","kind":"long","required":true},{"key":"draftIntro","label":"draftIntro","kind":"long","required":true},{"key":"draftPrivacy","label":"draftPrivacy","kind":"long","required":true},{"key":"draftRetention","label":"draftRetention","kind":"long","required":true},{"key":"backLabel","label":"backLabel","kind":"long","required":true},{"key":"clearLabel","label":"clearLabel","kind":"long","required":true},{"key":"clearConfirmLabel","label":"clearConfirmLabel","kind":"long","required":true},{"key":"cancelLabel","label":"cancelLabel","kind":"long","required":true},{"key":"clearedMessage","label":"clearedMessage","kind":"long","required":true},{"key":"printLabel","label":"printLabel","kind":"long","required":true},{"key":"nextLabel","label":"nextLabel","kind":"long","required":true},{"key":"previousLabel","label":"previousLabel","kind":"long","required":true},{"key":"resourcesTitle","label":"resourcesTitle","kind":"long","required":true},{"key":"resourcesIntro","label":"resourcesIntro","kind":"long","required":true},{"key":"resourceTitle","label":"resourceTitle","kind":"long","required":true},{"key":"resourceIntro","label":"resourceIntro","kind":"long","required":true},{"key":"toolkitLabel","label":"toolkitLabel","kind":"long","required":true},{"key":"briefsLabel","label":"briefsLabel","kind":"long","required":true},{"key":"scenarioNote","label":"scenarioNote","kind":"long","required":true},{"key":"culturalContext","label":"culturalContext","kind":"long","required":true},{"key":"authorityNote","label":"authorityNote","kind":"long","required":true},{"key":"decisionTitle","label":"decisionTitle","kind":"long","required":true},{"key":"decisionIntro","label":"decisionIntro","kind":"long","required":true},{"key":"decisionObjectives","label":"decisionObjectives","kind":"string-list","required":true,"maxItems":5},{"key":"decisionScenario","label":"decisionScenario","kind":"long","required":true},{"key":"decisionChoicea","label":"decisionChoicea","kind":"long","required":true},{"key":"decisionConsequencea","label":"decisionConsequencea","kind":"long","required":true},{"key":"decisionChoiceb","label":"decisionChoiceb","kind":"long","required":true},{"key":"decisionConsequenceb","label":"decisionConsequenceb","kind":"long","required":true},{"key":"decisionChoicec","label":"decisionChoicec","kind":"long","required":true},{"key":"decisionConsequencec","label":"decisionConsequencec","kind":"long","required":true},{"key":"decisionDraftLabel","label":"decisionDraftLabel","kind":"long","required":true},{"key":"decisionDraftHelp","label":"decisionDraftHelp","kind":"long","required":true},{"key":"peopleTitle","label":"peopleTitle","kind":"long","required":true},{"key":"peopleIntro","label":"peopleIntro","kind":"long","required":true},{"key":"peopleObjectives","label":"peopleObjectives","kind":"string-list","required":true,"maxItems":5},{"key":"peopleScenario","label":"peopleScenario","kind":"long","required":true},{"key":"peopleChoicea","label":"peopleChoicea","kind":"long","required":true},{"key":"peopleConsequencea","label":"peopleConsequencea","kind":"long","required":true},{"key":"peopleChoiceb","label":"peopleChoiceb","kind":"long","required":true},{"key":"peopleConsequenceb","label":"peopleConsequenceb","kind":"long","required":true},{"key":"peopleChoicec","label":"peopleChoicec","kind":"long","required":true},{"key":"peopleConsequencec","label":"peopleConsequencec","kind":"long","required":true},{"key":"peopleDraftLabel","label":"peopleDraftLabel","kind":"long","required":true},{"key":"peopleDraftHelp","label":"peopleDraftHelp","kind":"long","required":true},{"key":"optionsTitle","label":"optionsTitle","kind":"long","required":true},{"key":"optionsIntro","label":"optionsIntro","kind":"long","required":true},{"key":"optionsObjectives","label":"optionsObjectives","kind":"string-list","required":true,"maxItems":5},{"key":"optionsScenario","label":"optionsScenario","kind":"long","required":true},{"key":"optionsChoicea","label":"optionsChoicea","kind":"long","required":true},{"key":"optionsConsequencea","label":"optionsConsequencea","kind":"long","required":true},{"key":"optionsChoiceb","label":"optionsChoiceb","kind":"long","required":true},{"key":"optionsConsequenceb","label":"optionsConsequenceb","kind":"long","required":true},{"key":"optionsChoicec","label":"optionsChoicec","kind":"long","required":true},{"key":"optionsConsequencec","label":"optionsConsequencec","kind":"long","required":true},{"key":"optionsDraftLabel","label":"optionsDraftLabel","kind":"long","required":true},{"key":"optionsDraftHelp","label":"optionsDraftHelp","kind":"long","required":true},{"key":"participationTitle","label":"participationTitle","kind":"long","required":true},{"key":"participationIntro","label":"participationIntro","kind":"long","required":true},{"key":"participationObjectives","label":"participationObjectives","kind":"string-list","required":true,"maxItems":5},{"key":"participationScenario","label":"participationScenario","kind":"long","required":true},{"key":"participationChoicea","label":"participationChoicea","kind":"long","required":true},{"key":"participationConsequencea","label":"participationConsequencea","kind":"long","required":true},{"key":"participationChoiceb","label":"participationChoiceb","kind":"long","required":true},{"key":"participationConsequenceb","label":"participationConsequenceb","kind":"long","required":true},{"key":"participationChoicec","label":"participationChoicec","kind":"long","required":true},{"key":"participationConsequencec","label":"participationConsequencec","kind":"long","required":true},{"key":"participationDraftLabel","label":"participationDraftLabel","kind":"long","required":true},{"key":"participationDraftHelp","label":"participationDraftHelp","kind":"long","required":true},{"key":"reviewTitle","label":"reviewTitle","kind":"long","required":true},{"key":"reviewIntro","label":"reviewIntro","kind":"long","required":true},{"key":"reviewObjectives","label":"reviewObjectives","kind":"string-list","required":true,"maxItems":5},{"key":"reviewScenario","label":"reviewScenario","kind":"long","required":true},{"key":"reviewChoicea","label":"reviewChoicea","kind":"long","required":true},{"key":"reviewConsequencea","label":"reviewConsequencea","kind":"long","required":true},{"key":"reviewChoiceb","label":"reviewChoiceb","kind":"long","required":true},{"key":"reviewConsequenceb","label":"reviewConsequenceb","kind":"long","required":true},{"key":"reviewChoicec","label":"reviewChoicec","kind":"long","required":true},{"key":"reviewConsequencec","label":"reviewConsequencec","kind":"long","required":true},{"key":"reviewDraftLabel","label":"reviewDraftLabel","kind":"long","required":true},{"key":"reviewDraftHelp","label":"reviewDraftHelp","kind":"long","required":true},{"key":"supportingResources","label":"Toolkit and related resource links","kind":"link-list","required":true,"maxItems":20},{"key":"leadershipLabel","label":"leadership: name","kind":"short","required":true},{"key":"leadershipContext","label":"leadership: work connection","kind":"long","required":true},{"key":"policyLabel","label":"policy: name","kind":"short","required":true},{"key":"policyContext","label":"policy: work connection","kind":"long","required":true},{"key":"serviceLabel","label":"service: name","kind":"short","required":true},{"key":"serviceContext","label":"service: work connection","kind":"long","required":true},{"key":"managementLabel","label":"management: name","kind":"short","required":true},{"key":"managementContext","label":"management: work connection","kind":"long","required":true},{"key":"workforceLabel","label":"workforce: name","kind":"short","required":true},{"key":"workforceContext","label":"workforce: work connection","kind":"long","required":true},{"key":"fiscalLabel","label":"fiscal: name","kind":"short","required":true},{"key":"fiscalContext","label":"fiscal: work connection","kind":"long","required":true},{"key":"dataLabel","label":"data: name","kind":"short","required":true},{"key":"dataContext","label":"data: work connection","kind":"long","required":true},{"key":"engagementLabel","label":"engagement: name","kind":"short","required":true},{"key":"engagementContext","label":"engagement: work connection","kind":"long","required":true},{"key":"communicationLabel","label":"communication: name","kind":"short","required":true},{"key":"communicationContext","label":"communication: work connection","kind":"long","required":true},{"key":"equityLabel","label":"equity: name","kind":"short","required":true},{"key":"equityContext","label":"equity: work connection","kind":"long","required":true}],"protectedFields":[],"requiredReviewDimensions":["language_alignment","factual_currentness","accessibility","scope","placement"],"approvedValues":{"title":"Equity Analysis Toolkit","intro":"Examine how a decision may affect people differently, consider alternatives, and prepare for a conversation about what should happen next.","companionNote":"These five learning stages are a program companion, not the official toolkit sequence. Optional practice does not replace the toolkit, required review, or engagement with affected people.","roleLabel":"Your area of work","roleIntro":"Choose an area to connect the example with your responsibilities. You can explore any area.","noRoleLabel":"Explore without choosing an area","stageNavLabel":"Learning stages","objectivesTitle":"After this stage, you can","scenarioTitle":"Try a fictional example","consequenceTitle":"What this choice brings into view","practiceLabel":"Optional practice","workLabel":"Your actual work","draftTitle":"Your working draft","draftIntro":"Keep your actual work separate from the fictional example. These notes support discussion; they are not an approval or a completed equity review.","draftPrivacy":"Use a general description of the work. Do not enter names, case details, or other confidential information. Keep any copy only in a location permitted for your work.","draftRetention":"Your notes disappear when you leave or reload this page. Print or save your draft before leaving if you want to keep a copy.","backLabel":"Learning and resources","clearLabel":"Clear my draft","clearConfirmLabel":"Clear all draft notes","cancelLabel":"Keep my notes","clearedMessage":"Your draft notes have been cleared.","printLabel":"Print or save my draft","nextLabel":"Next stage","previousLabel":"Previous stage","resourcesTitle":"Toolkit and related resources","resourcesIntro":"Open resources at any time. You do not need to finish a lesson or practice activity.","resourceTitle":"Official policy and related resources","resourceIntro":"The DHS equity policy and toolkit resource are available here without completing the learning stages. Follow DHS instructions for access to internal materials and any required review. This companion does not submit work to DHS or grant approval. DHS requirements should not be treated as requirements for every Minnesota agency.","toolkitLabel":"Open the Equity Analysis Toolkit","briefsLabel":"Explore community briefs","scenarioNote":"All people, records, and events in this example are fictional. The consequences illustrate questions to consider; they are qualitative examples, not predictions of real outcomes.","culturalContext":"Community briefs can help you ask more informed questions. They do not tell you what an individual believes, needs, or prefers. Confirm preferences with the person and involve affected communities in real decisions.","authorityNote":"The people responsible for the decision retain authority. A practice response cannot establish community agreement or replace direct engagement.","decisionTitle":"Describe the decision","decisionIntro":"Start with the decision itself: what is changing, what can still be changed, and who can decide. A clear scope helps people contribute while their input can still matter.","decisionObjectives":["Write a one-sentence description of the decision.","Distinguish fixed conditions from choices still open.","Identify who has decision authority.","Locate the related questions in the official toolkit."],"decisionScenario":"A service team is considering replacing mailed appointment reminders with text messages. Alex Rivera works changing shifts and shares one phone with Elena, who helps manage appointments and prefers written information in Spanish. These are their stated circumstances, not assumptions based on their names. What should the team clarify first?","decisionChoicea":"Choose text messages now and discuss implementation later.","decisionConsequencea":"In this fictional continuation, Elena raises the shared-phone concern after the proposal has been presented as settled. Ask which choices remain open and whether people can still influence them.","decisionChoiceb":"Define the reminder decision, its limits, and who can authorize a change.","decisionConsequenceb":"The team separates the reminder method from rules it has no authority to change. It can now ask people about options that are genuinely open, while confirming applicable requirements with the responsible reviewer.","decisionChoicec":"Keep the existing process without further discussion.","decisionConsequencec":"Another fictional household reports unreliable mail delivery. Keeping the process also has effects worth examining; the team still needs to understand the problem and its authority to respond.","decisionDraftLabel":"The decision and its limits","decisionDraftHelp":"Describe the decision, what can change, and who has authority. Name any requirement that still needs to be confirmed.","peopleTitle":"Consider who may be affected","peopleIntro":"Look for differences in access, benefits, and burdens. Separate what the evidence shows from what you are assuming, and identify whose experience is missing.","peopleObjectives":["Identify people who may experience the decision differently.","Separate evidence from assumptions.","Name an information gap or missing perspective.","Write a respectful question to learn more."],"peopleScenario":"The fictional records show that a text reached Alex's phone. They do not show whether Elena could read it in time. Another household member uses a screen reader, and a different household prefers mail for privacy. What information would you seek?","peopleChoicea":"Treat successful delivery as evidence that the reminder was usable.","peopleConsequencea":"The delivery record answers a narrow question. It cannot establish who read the message, whether it was understandable, or whether using it was private and accessible.","peopleChoiceb":"Ask staff which reminder method most people prefer.","peopleConsequenceb":"Staff describe recurring difficulties, which helps identify questions. Their experience does not establish each person's preferences or replace hearing directly from people using the service.","peopleChoicec":"Combine available records with accessible conversations about preferences and barriers.","peopleConsequencec":"Elena explains when she can access the shared phone. Other people describe different needs. The team has richer information but still checks who could not participate and avoids treating one family as representative of a community.","peopleDraftLabel":"People, evidence, and unanswered questions","peopleDraftHelp":"Note potential differences in experience, the evidence available, and whose perspective you still need. Avoid identifying individual clients.","optionsTitle":"Compare possible approaches","optionsIntro":"Compare workable alternatives, including the current approach. Consider who gains convenience, who takes on additional work, and what could make each approach more accessible.","optionsObjectives":["Describe at least two feasible approaches.","Identify a potential benefit and burden of each.","Explain how an adjustment addresses a specific barrier.","State what remains uncertain before a choice is made."],"optionsScenario":"The team considers three approaches. In the fictional example, Alex wants texts, Elena needs information she can read in Spanish, and another household relies on paper reminders. Choose an approach to examine, not a final answer.","optionsChoicea":"Use text messages as the only reminder method.","optionsConsequencea":"Alex sees a reminder quickly during a break, but Elena cannot access the shared phone when she needs it. The team must examine language, shared-device access, privacy, and alternatives for people who cannot use texts.","optionsChoiceb":"Continue mailing every reminder.","optionsConsequenceb":"A household that prefers paper keeps its familiar method. Another household receives a reminder late. Keeping mail does not resolve all access concerns, and the team needs evidence about those remaining barriers.","optionsChoicec":"Offer a choice of reminder methods and confirm communication preferences.","optionsConsequencec":"Different households can request different methods. Staff then identify the work needed to record, honor, and update those preferences. Choice deserves examination alongside staffing, accessibility, privacy, and applicable requirements; it is not automatically the best answer in every setting.","optionsDraftLabel":"Options and tradeoffs","optionsDraftHelp":"Compare two or more approaches. Include possible benefits, burdens, adjustments, and uncertainties rather than predicting results.","participationTitle":"Plan participation and action","participationIntro":"Identify who should help shape the decision and what would make participation possible. Explain what people can influence and how they will hear what happened to their input.","participationObjectives":["Identify who should help shape the decision.","Propose an accessible way to seek participation.","Assign a responsible person to a proposed action.","Explain how participants will hear what happened to their input."],"participationScenario":"Before recommending a reminder approach, the team wants to hear from service users. Alex cannot attend a daytime meeting. Elena would prefer a conversation in Spanish. Which engagement plan would you examine?","participationChoicea":"Send one English-only online questionnaire.","participationConsequencea":"In the fictional responses, people comfortable with that channel are heard more readily. The team has not established what people excluded by language, disability access, connectivity, or confidence with forms would say.","participationChoiceb":"Ask an advisory group to speak for every household.","participationConsequenceb":"The group contributes useful experience and questions. Its members cannot represent every household's circumstances. The team still needs to identify missing perspectives and accessible ways to hear them.","participationChoicec":"Offer several accessible ways to participate and explain what remains open.","participationConsequencec":"People have more ways to contribute, and the team plans language and disability access with participants. It still needs time, responsible staff, and a clear account of how input affected the decision. This practice cannot supply actual community agreement.","participationDraftLabel":"Participation and next actions","participationDraftHelp":"Identify people to involve, participation supports, decisions they can influence, responsible staff, and how you will report back.","reviewTitle":"Review and revisit","reviewIntro":"Plan how people will examine what happens after a decision. Choose information that can reveal problems, name its limits, and agree on when the decision needs another look.","reviewObjectives":["Identify an observable signal worth reviewing.","Explain what that signal cannot establish.","Name who will review the information.","Specify a condition that would prompt reconsideration."],"reviewScenario":"Suppose the responsible decision-makers authorize a limited change after the required review and engagement. The team now needs a follow-up plan. What would you recommend examining?","reviewChoicea":"Count delivered messages and call the change successful if delivery improves.","reviewConsequencea":"The count helps assess delivery but does not establish comprehension, access, privacy, or fair outcomes. It could miss a problem even when more messages reach their destinations.","reviewChoiceb":"Wait for complaints before scheduling a review.","reviewConsequenceb":"Complaints may reveal an important problem, but some people may not know how or feel able to raise one. Without a planned review, silence could be mistaken for evidence that the approach works for everyone.","reviewChoicec":"Review several signals with responsible staff and affected people at an agreed time.","reviewConsequencec":"The team considers delivery, reported usability, staff workload, and people not reached. It names the limits of each source and agrees what would trigger reconsideration. Those observations support human judgment rather than proving that one change caused an outcome.","reviewDraftLabel":"Review responsibilities and reconsideration","reviewDraftHelp":"Name useful signals, their limits, a review date, responsible people, and a condition that would prompt another discussion.","supportingResources":[{"label":"DHS equity policy","href":"https://mn.gov/dhs/assets/equity-policy_tcm1053-646921.pdf"},{"label":"Equity Analysis Toolkit resource and access details","href":"/library/ext-dhs-equity-toolkit"},{"label":"Minnesota community briefs","href":"/minnesota-communities"},{"label":"Learning for your work","href":"/my-work/explore"}],"leadershipLabel":"Executive and division leadership","leadershipContext":"Consider the decision authority, unresolved tradeoffs, and responsibility for follow-through. Ask what evidence and engagement are needed before a direction is approved.","policyLabel":"Policy and program analysis","policyContext":"Compare the reminder options, distinguish policy requirements from local choices, and describe uncertainty in the recommendation.","serviceLabel":"Eligibility and service delivery","serviceContext":"Consider what a person must do to receive and use a reminder. Record barriers for the responsible decision-maker without assuming authority to change policy.","managementLabel":"Supervision and management","managementContext":"Examine staff capacity, consistent practice, and how staff can raise concerns. Identify the support needed to honor communication preferences.","workforceLabel":"Hiring and workforce development","workforceContext":"Consider the skills, learning time, and support staff need to provide accessible service. Examine whether expectations create unequal access to development opportunities.","fiscalLabel":"Budgets, grants, and contracts","fiscalContext":"Examine implementation costs and work shifted to households or staff. Identify resource questions without inventing cost estimates or assuming the least expensive option is the fairest.","dataLabel":"Data, research, and quality","dataContext":"Distinguish message delivery from usable communication. Examine missing information, the limits of comparisons, and whose experiences the available records cannot show.","engagementLabel":"Community engagement and partnership","engagementContext":"Plan how affected people can influence the reminder decision. Consider language, disability access, timing, trust, and how participants will hear what changed.","communicationLabel":"Communication and accessibility","communicationContext":"Examine whether each reminder is understandable and usable in the needed language and format. Plan appropriate translation, accessibility review, and review with service users.","equityLabel":"Equity practice and organizational change","equityContext":"Connect a specific access barrier with the wider decision process. Identify responsible partners and how engagement and follow-through will remain part of the work."}}]$pac_registry$::jsonb;
  seed jsonb;
  seed_surface_id text;
  seed_scope_id text;
  seed_fields jsonb;
  seed_protected text[];
  seed_reviews text[];
  seed_document jsonb;
  seed_revision_id uuid;
  seed_publish boolean;
  review_dimension text;
  existing_definition pac.surface_definitions%rowtype;
begin
  for seed in select value from jsonb_array_elements(registry_seed)
  loop
    seed_surface_id := seed ->> 'surfaceId';
    if seed_surface_id <> 'equity-toolkit.home' or seed ->> 'scopePolicy' <> 'inheritable' then
      raise exception 'This migration only registers the inheritable toolkit companion';
    end if;
    seed_publish := seed_surface_id not like 'community-brief.%';
    seed_fields := seed -> 'fieldContract';
    seed_protected := array(
      select value from jsonb_array_elements_text(coalesce(seed -> 'protectedFields', '[]'::jsonb))
    );
    seed_reviews := array(
      select value from jsonb_array_elements_text(seed -> 'requiredReviewDimensions')
    );
    seed_scope_id := case when seed ->> 'scopePolicy' = 'dsd' then 'dsd' else 'one-dhs' end;

    insert into pac.surface_definitions (
      surface_id, route_pattern, staff_label, scope_policy, schema_version,
      field_contract, protected_fields, required_review_dimensions,
      linked_content_item_id, active, registered_by
    ) values (
      seed_surface_id,
      seed ->> 'routePattern',
      seed ->> 'staffLabel',
      seed ->> 'scopePolicy',
      1,
      seed_fields,
      seed_protected,
      seed_reviews,
      null,
      true,
      'pac-forward-migration-0022'
    )
    on conflict (surface_id) do nothing;

    select * into strict existing_definition
    from pac.surface_definitions where surface_id = seed_surface_id;
    if existing_definition.route_pattern is distinct from seed ->> 'routePattern'
      or existing_definition.staff_label is distinct from seed ->> 'staffLabel'
      or existing_definition.scope_policy is distinct from seed ->> 'scopePolicy'
      or existing_definition.schema_version <> 1
      or existing_definition.field_contract is distinct from seed_fields
      or existing_definition.protected_fields is distinct from seed_protected
      or existing_definition.required_review_dimensions is distinct from seed_reviews
      or existing_definition.active is distinct from true then
      raise exception 'Existing editable surface % does not match the registered application contract', seed_surface_id
        using errcode = '55000';
    end if;

    seed_document := jsonb_build_object(
      'schemaVersion', 1,
      'surfaceId', seed_surface_id,
      'scope', seed_scope_id,
      'values', seed -> 'approvedValues'
    );
    perform pac.assert_valid_surface_document(seed_surface_id, seed_scope_id, seed_document);

    select revision.revision_id into seed_revision_id
    from pac.surface_revisions revision
    where revision.surface_id = seed_surface_id
      and revision.scope_id = seed_scope_id
      and revision.document = seed_document
      and revision.change_note = 'Initial owner-approved wording for governed review.'
    order by revision.revision_number
    limit 1;

    if seed_revision_id is null then
      if exists (
        select 1 from pac.surface_revisions revision
        where revision.surface_id = seed_surface_id and revision.scope_id = seed_scope_id
      ) then
        raise exception 'Existing editable surface % is missing its approved baseline', seed_surface_id
          using errcode = '55000';
      end if;

      insert into pac.surface_revisions (
        surface_id, scope_id, revision_number, document, change_note,
        required_review_dimensions, created_by, based_on_revision_id
      ) values (
        seed_surface_id, seed_scope_id, 1, seed_document,
        'Initial owner-approved wording for governed review.', seed_reviews,
        'pac-forward-migration-0022', null
      ) returning revision_id into seed_revision_id;

      foreach review_dimension in array seed_reviews
      loop
        insert into pac.surface_reviews (
          revision_id, dimension, status, note, reviewer_role, reviewer_id
        ) values (
          seed_revision_id, review_dimension,
          case when seed_publish then 'pass' else 'pending' end,
          case
            when seed_publish then 'Approved baseline wording registered with the application.'
            else 'Review is required before this community wording can be published.'
          end,
          'publishing_approver', 'pac-consultant-workspace-owner'
        );
      end loop;

      if seed_publish then
        insert into pac.surface_publication_decisions (
          surface_id, scope_id, revision_id, decision, gate_snapshot, reason, decided_by
        ) values (
          seed_surface_id, seed_scope_id, seed_revision_id, 'publish',
          jsonb_build_object(
            'requiredReviewsComplete', true,
            'registeredFieldsChecked', true,
            'staffLanguageChecked', true,
            'plainTextChecked', true,
            'iconsChecked', true,
            'exactApprovedCopyCaptured', true,
            'explicitOwnerApproval', true,
            'seedMigration', '0022_pac_equity_toolkit_surface.sql'
          ),
          'Initial owner-approved staff wording.',
          'pac-forward-migration-0022'
        );

        insert into pac.surface_change_events (
          surface_id, scope_id, revision_id, publication_decision_id,
          action, detail, actor_id, actor_role
        )
        select seed_surface_id, seed_scope_id, seed_revision_id,
          decision_record.publication_decision_id, 'published',
          jsonb_build_object('initialApprovedCopy', true, 'staffCopyChanged', true),
          'pac-forward-migration-0022', 'migration'
        from pac.surface_publication_decisions decision_record
        where decision_record.surface_id = seed_surface_id
          and decision_record.scope_id = seed_scope_id
          and decision_record.revision_id = seed_revision_id
          and decision_record.decision = 'publish'
        order by decision_record.publication_decision_id desc
        limit 1;
      else
        insert into pac.surface_change_events (
          surface_id, scope_id, revision_id, action, detail, actor_id, actor_role
        ) values (
          seed_surface_id, seed_scope_id, seed_revision_id, 'draft_created',
          jsonb_build_object(
            'initialOwnerApprovedIngestion', true,
            'publicationPending', true,
            'representationReviewPending', true,
            'staffPublicationUnchanged', true
          ),
          'pac-forward-migration-0022', 'migration'
        );
      end if;
    elsif seed_publish and not exists (
      select 1 from pac.surface_publication_decisions decision_record
      where decision_record.surface_id = seed_surface_id
        and decision_record.scope_id = seed_scope_id
        and decision_record.revision_id = seed_revision_id
        and decision_record.decision = 'publish'
    ) then
      raise exception 'Approved editable surface % has no preserved publication decision', seed_surface_id
        using errcode = '55000';
    end if;
  end loop;
end;
$pac_seed$;

commit;

