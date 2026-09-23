# Learning credit: owner clarification

September 8, 2026. Internal program guidance; do not display this planning record as staff copy.

## Request and purpose

Apply the owner's explicit program-wide rule: participation and course completion in One DHS/One DSD People, Access and Culture do not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception. Preserve original sources, privacy, voluntary participation, and existing policy obligations.

The purpose is to help staff understand what the program offers without mistaking useful learning, a completed activity, or a saved work product for required-training credit.

## Canonical wording

Participation and course completion in this program do not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.

The pure shared module, lib/program/learning-credit.ts, exports TRAINING_CREDIT_NOTICE for staff copy and trainingCreditContext() for reasoning context. The latter states that no exception is established by the program, that referral or encouragement does not establish one, and that the program cannot grant or verify an exception without actual evidence of the relevant authorization. It does not prescribe a new approval workflow or imply a connection to DHS's training-record system.

Optional participation does not waive official duties, required training, or applicable Equity Analysis Toolkit obligations. An exception concerning training credit does not automatically change those duties or make browser notes and progress official DHS records.

## Narrow implementation

- Learning and guided-practice notices show the same concise rule once, alongside their unchanged privacy and storage information.
- Relevant ASK, learning, practice, personal-work, consultation, and One DSD Team participation-contract purposes use that shared rule. Their requirements, viewers, record types, recording behavior, and retention facts are unchanged.
- The learning official-record sentence now states the actual record boundary without contradicting the possibility of an expressly authorized training-credit exception.
- Original source documents and recovered course wording are untouched. No exception, accreditation, credit award, agency endorsement, policy waiver, or integration with official completion records is created.

## Other wording reviewed

A targeted search of program-authored TypeScript and page copy found no promise of training credits, certification, or accreditation. The standalone practice notice had an absolute no-credit sentence; it is replaced by the shared rule. Existing references describing optional support as not required training remain accurate and are qualified in the relevant contracts. The consultation notice continues to explain that submitting a request is not an official DHS record or evidence of required training; that is a record-creation fact, not a denial of the owner's exception rule.

A leadership orientation example mentions a new colleague completing required training before discovering additional support needs. It does not award credits through this program and requires no change. Source-only and historical material was not bulk-rewritten.

## Completion evidence

Focused tests in tests/training-credit.test.ts cover rendered Learning and Practice notices, consistency across eight relevant participation contracts, preservation of privacy and voluntary status, no inference of an exception from encouragement or completion, and the distinction between a credit exception and existing obligations. The parent implementation pass will run these together with the existing participation-contract tests and integration checks. Test execution and local/production status must be reported from that actual run; this document alone is not proof that ASK used the context or that production changed.
