
-- 1. Task Management
CREATE TABLE public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to_team_member UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  assigned_role TEXT, -- for role-based assignment
  status TEXT NOT NULL DEFAULT 'todo', -- 'todo','in-progress','completed'
  deadline TIMESTAMP WITH TIME ZONE,
  created_by UUID, -- user id
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS Policies for project_tasks
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can read/view tasks"
  ON public.project_tasks
  FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owner or team member can insert/update/delete"
  ON public.project_tasks
  FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

-- 2. Shared File Storage/Linking (URLs, filenames, optional decentralized storage ref)
CREATE TABLE public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  filename TEXT,
  url TEXT,
  description TEXT,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view files"
  ON public.project_files
  FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owner or team member can upload/delete"
  ON public.project_files
  FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

-- 3. Milestone Tracking
CREATE TABLE public.project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view milestones"
  ON public.project_milestones
  FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owner or team member can manage milestones"
  ON public.project_milestones
  FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

-- 4. Activity Feed/Audit Log
CREATE TABLE public.project_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL, -- e.g. 'task_created','milestone_completed','file_shared'
  activity_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.project_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can read activity log"
  ON public.project_activity_log
  FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owner or team member can write to activity log"
  ON public.project_activity_log
  FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

-- 5. Discussion Threads
CREATE TABLE public.project_discussion_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  related_task_id UUID REFERENCES public.project_tasks(id) ON DELETE CASCADE,
  related_milestone_id UUID REFERENCES public.project_milestones(id) ON DELETE CASCADE,
  title TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.project_discussion_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view discussion threads"
  ON public.project_discussion_threads
  FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owner or team member can add threads"
  ON public.project_discussion_threads
  FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

-- 6. Discussion Messages
CREATE TABLE public.project_discussion_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.project_discussion_threads(id) ON DELETE CASCADE,
  posted_by UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.project_discussion_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view thread messages"
  ON public.project_discussion_messages
  FOR SELECT
  USING (
    thread_id IN (
      SELECT id FROM public.project_discussion_threads
      WHERE project_id IN (
        SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
        UNION
        SELECT id FROM public.projects WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "Project owner or team member can post thread messages"
  ON public.project_discussion_messages
  FOR ALL
  TO authenticated
  USING (
    thread_id IN (
      SELECT id FROM public.project_discussion_threads
      WHERE project_id IN (
        SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
        UNION
        SELECT id FROM public.projects WHERE owner_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    thread_id IN (
      SELECT id FROM public.project_discussion_threads
      WHERE project_id IN (
        SELECT project_id FROM public.team_members WHERE user_id = auth.uid() OR wallet_address = (SELECT wallet_address FROM public.team_members WHERE user_id = auth.uid())
        UNION
        SELECT id FROM public.projects WHERE owner_id = auth.uid()
      )
    )
  );
