
-- Recreate the view v_stats WITHOUT SECURITY DEFINER (default is SECURITY INVOKER)
DROP VIEW IF EXISTS public.v_stats;

CREATE VIEW public.v_stats AS
SELECT
  COALESCE(SUM(escrow_funded_amount), 0) AS total_streamed,
  COUNT(*) AS total_drops
FROM projects
WHERE status = 'complete';
