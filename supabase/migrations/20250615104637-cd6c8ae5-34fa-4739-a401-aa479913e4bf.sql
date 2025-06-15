
-- 1. Create stats view for tracked totals (total USDC streamed, number of completed drops)
create or replace view v_stats as
select
  coalesce(sum(escrow_funded_amount),0) as total_streamed,
  count(*)                              as total_drops
from projects
where status = 'complete';

-- 2. (Optional, but recommended) Add a function for clean API delivery
create or replace function public.get_stats()
returns table(total_streamed numeric, total_drops integer)
language sql
as $$
  select * from v_stats;
$$;

-- 3. Enable RLS as needed if view/table exposes sensitive data; 
-- skip for public stats, or add policies as needed.
