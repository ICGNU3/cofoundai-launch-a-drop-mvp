
-- Add a 'status' column (default 'minted') to the projects table
ALTER TABLE public.projects
  ADD COLUMN status TEXT DEFAULT 'minted';

-- Allow project owners to update/read status
-- (Assuming owner policies already exist, if not let me know!)
