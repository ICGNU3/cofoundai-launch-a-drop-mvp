
-- Add columns to projects table for on-chain state
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS token_address TEXT,
ADD COLUMN IF NOT EXISTS tx_hash TEXT,
ADD COLUMN IF NOT EXISTS expense_sum NUMERIC(18,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS escrow_funded_amount NUMERIC(18,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS streams_active BOOLEAN DEFAULT FALSE;

-- Add columns to project_roles for stream data
ALTER TABLE public.project_roles 
ADD COLUMN IF NOT EXISTS stream_flow_rate NUMERIC(18,6) DEFAULT 0,
ADD COLUMN IF NOT EXISTS stream_active BOOLEAN DEFAULT FALSE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_owner_minted ON public.projects(owner_id, minted_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_roles_project_id ON public.project_roles(project_id);
