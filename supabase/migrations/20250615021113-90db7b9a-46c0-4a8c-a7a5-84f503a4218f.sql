
-- Table for creative Drops/Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  minted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  project_idea TEXT NOT NULL,
  project_type TEXT NOT NULL,
  pledge_usdc NUMERIC(18,2) DEFAULT 0,
  wallet_address TEXT,
  zora_coin_url TEXT,
  cover_art_url TEXT,
  funding_total NUMERIC(18,2) DEFAULT 0,
  funding_target NUMERIC(18,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Each role in a project
CREATE TABLE public.project_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  wallet_address TEXT,
  percent NUMERIC(5,2) NOT NULL
);

-- Each expense in a project
CREATE TABLE public.project_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  vendor_wallet TEXT,
  amount_usdc NUMERIC(18,2) NOT NULL,
  payout_type TEXT
);

-- Funding events for real-time status
CREATE TABLE public.funding_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  pledged_by UUID,
  amount NUMERIC(18,2) NOT NULL,
  pledged_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Project engagement analytics
CREATE TABLE public.project_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  last_engagement_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Project history links a user to all their projects (owner_id on projects is already doing this).
-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_analytics ENABLE ROW LEVEL SECURITY;

-- Owner can read/write their projects
CREATE POLICY "Owner can access their projects"
  ON public.projects
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Owner can access related roles/expenses/history
CREATE POLICY "Owner can access roles"
  ON public.project_roles
  USING (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
  );

CREATE POLICY "Owner can access expenses"
  ON public.project_expenses
  USING (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
  );

CREATE POLICY "Owner can access analytics"
  ON public.project_analytics
  USING (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
  );

CREATE POLICY "Anyone can add funding events"
  ON public.funding_events
  FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Owner can view funding events"
  ON public.funding_events
  FOR SELECT
  USING (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
  );

-- Optionally, public can view analytics (for engagement/share stats)
CREATE POLICY "Anyone can view analytics"
  ON public.project_analytics
  FOR SELECT
  USING (TRUE);
