
-- Recreate the view v_stats WITHOUT SECURITY DEFINER property (PostgreSQL's default is SECURITY INVOKER)
CREATE OR REPLACE VIEW public.v_stats AS
SELECT
  COALESCE(SUM(escrow_funded_amount), 0) AS total_streamed,
  COUNT(*) AS total_drops
FROM projects
WHERE status = 'complete';
