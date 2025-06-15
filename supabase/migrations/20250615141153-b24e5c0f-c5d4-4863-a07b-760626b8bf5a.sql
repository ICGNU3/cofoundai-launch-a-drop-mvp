
-- Set a secure, explicit search_path on the function
CREATE OR REPLACE FUNCTION public.get_stats()
RETURNS TABLE(total_streamed numeric, total_drops integer)
LANGUAGE sql
SET search_path = public
AS $$
  SELECT * FROM v_stats;
$$;
