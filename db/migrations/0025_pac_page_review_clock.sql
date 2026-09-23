-- Preserve append-only page review history while ordering pending and completed
-- reviews by their actual recording time within a single release transaction.
BEGIN;
ALTER TABLE pac.review_records ALTER COLUMN recorded_at SET DEFAULT clock_timestamp();
COMMIT;
