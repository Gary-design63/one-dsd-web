-- Preserve append-only review history while ordering decisions within a single
-- publication transaction by the time each review was actually recorded.
-- now() is transaction-stable and could tie pending and accepted reviews.
BEGIN;
ALTER TABLE pac.surface_reviews ALTER COLUMN recorded_at SET DEFAULT clock_timestamp();
COMMIT;
