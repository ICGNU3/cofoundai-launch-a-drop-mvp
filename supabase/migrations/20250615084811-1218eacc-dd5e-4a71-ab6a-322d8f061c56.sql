
-- 1. Table for Team Members (accepted members)
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID, -- nullable, populated after signup/login
  wallet_address TEXT, -- for wallet-based memberships
  invited_email TEXT,
  assigned_role TEXT NOT NULL,
  onboarded BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'removed', 'completed'
  joined_at TIMESTAMP WITH TIME ZONE,
  exited_at TIMESTAMP WITH TIME ZONE
);

-- 2. Table for Invitations (pending or unaccepted invites)
CREATE TABLE public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL, -- user ID of inviter
  invited_email TEXT,
  invited_wallet TEXT,
  assigned_role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  token TEXT UNIQUE, -- For secure invite acceptance
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  declined_at TIMESTAMP WITH TIME ZONE
);

-- 3. Table for RBAC: which permissions are given to each role type
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL,
  permission TEXT NOT NULL
);

-- 4. Onboarding Steps per Role
CREATE TABLE public.onboarding_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name TEXT NOT NULL,
  step_order INTEGER,
  step_title TEXT NOT NULL,
  step_description TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE
);

-- 5. Contributions (basic checklists for each team member)
CREATE TABLE public.contribution_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 6. Simple Team Communication/Chat
CREATE TABLE public.team_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  team_member_id UUID, -- optional, can be null for system/announcements
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  message_type TEXT DEFAULT 'chat' -- 'chat', 'announcement', etc.
);

-- Enable Row Level Security on all tables
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;

-- Baseline security policies (to be refined depending on app logic—for now only creator can select/insert/update/delete in their project)
CREATE POLICY "Project creator can manage team_members"
  ON public.team_members
  USING (project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid()));

CREATE POLICY "Project creator can manage invitations"
  ON public.team_invitations
  USING (project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid()));

CREATE POLICY "Project creator can manage role_permissions"
  ON public.role_permissions
  USING (project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid()));

CREATE POLICY "Project creator can manage onboarding_steps"
  ON public.onboarding_steps
  USING (project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid()) OR project_id IS NULL)
  WITH CHECK (project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid()) OR project_id IS NULL);

CREATE POLICY "Team member can view own contributions"
  ON public.contribution_checklists
  FOR SELECT
  USING (team_member_id IN (SELECT id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())))
  ;

CREATE POLICY "Project creator can manage contributions"
  ON public.contribution_checklists
  USING (project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid()));

CREATE POLICY "Team member/creator can read messages"
  ON public.team_messages
  FOR SELECT
  USING (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
    OR team_member_id IN (SELECT id FROM public.team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Project creator/team member can send messages"
  ON public.team_messages
  FOR INSERT
  WITH CHECK (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
    OR team_member_id IN (SELECT id FROM public.team_members WHERE user_id = auth.uid())
  );

