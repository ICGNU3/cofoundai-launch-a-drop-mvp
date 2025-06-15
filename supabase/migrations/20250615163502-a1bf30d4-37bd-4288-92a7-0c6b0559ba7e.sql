
-- Add missing RLS policies for contribution_checklists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contribution_checklists' AND policyname = 'Team members can view their own contributions') THEN
    CREATE POLICY "Team members can view their own contributions"
      ON public.contribution_checklists
      FOR SELECT
      USING (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR team_member_id IN (
          SELECT id FROM public.team_members WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contribution_checklists' AND policyname = 'Project owners can manage contributions') THEN
    CREATE POLICY "Project owners can manage contributions"
      ON public.contribution_checklists
      FOR ALL
      USING (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
      )
      WITH CHECK (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contribution_checklists' AND policyname = 'Team members can update their own contributions') THEN
    CREATE POLICY "Team members can update their own contributions"
      ON public.contribution_checklists
      FOR UPDATE
      USING (
        team_member_id IN (
          SELECT id FROM public.team_members WHERE user_id = auth.uid()
        )
      )
      WITH CHECK (
        team_member_id IN (
          SELECT id FROM public.team_members WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Add RLS policies for funding_events (public read for transparency, authenticated write)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funding_events' AND policyname = 'Anyone can view funding events') THEN
    CREATE POLICY "Anyone can view funding events"
      ON public.funding_events
      FOR SELECT
      USING (TRUE);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funding_events' AND policyname = 'Authenticated users can create funding events') THEN
    CREATE POLICY "Authenticated users can create funding events"
      ON public.funding_events
      FOR INSERT
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Add RLS policies for onboarding_steps
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'onboarding_steps' AND policyname = 'Project owners can manage onboarding steps') THEN
    CREATE POLICY "Project owners can manage onboarding steps"
      ON public.onboarding_steps
      FOR ALL
      USING (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR project_id IS NULL
      )
      WITH CHECK (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR project_id IS NULL
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'onboarding_steps' AND policyname = 'Team members can view their project onboarding steps') THEN
    CREATE POLICY "Team members can view their project onboarding steps"
      ON public.onboarding_steps
      FOR SELECT
      USING (
        project_id IN (
          SELECT tm.project_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
        )
        OR project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR project_id IS NULL
      );
  END IF;
END $$;

-- Add RLS policies for project_activity_log
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_activity_log' AND policyname = 'Project members can view activity') THEN
    CREATE POLICY "Project members can view activity"
      ON public.project_activity_log
      FOR SELECT
      USING (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR project_id IN (
          SELECT tm.project_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_activity_log' AND policyname = 'Project owners can manage activity log') THEN
    CREATE POLICY "Project owners can manage activity log"
      ON public.project_activity_log
      FOR ALL
      USING (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
      )
      WITH CHECK (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_activity_log' AND policyname = 'Team members can create activity entries') THEN
    CREATE POLICY "Team members can create activity entries"
      ON public.project_activity_log
      FOR INSERT
      WITH CHECK (
        project_id IN (
          SELECT tm.project_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
        )
        OR project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Fix overly permissive analytics policy
DROP POLICY IF EXISTS "Anyone can view analytics" ON public.project_analytics;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_analytics' AND policyname = 'Project members can view analytics') THEN
    CREATE POLICY "Project members can view analytics"
      ON public.project_analytics
      FOR SELECT
      USING (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR project_id IN (
          SELECT tm.project_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Add missing RLS policies for workspace files, milestones, and tasks (only the ones that don't exist)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_files' AND policyname = 'Project members can view files') THEN
    CREATE POLICY "Project members can view files"
      ON public.project_files
      FOR SELECT
      USING (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR project_id IN (
          SELECT tm.project_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_files' AND policyname = 'Project members can upload files') THEN
    CREATE POLICY "Project members can upload files"
      ON public.project_files
      FOR INSERT
      WITH CHECK (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR project_id IN (
          SELECT tm.project_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_milestones' AND policyname = 'Project members can view milestones') THEN
    CREATE POLICY "Project members can view milestones"
      ON public.project_milestones
      FOR SELECT
      USING (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR project_id IN (
          SELECT tm.project_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_milestones' AND policyname = 'Project members can manage milestones') THEN
    CREATE POLICY "Project members can manage milestones"
      ON public.project_milestones
      FOR ALL
      USING (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR project_id IN (
          SELECT tm.project_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
        )
      )
      WITH CHECK (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR project_id IN (
          SELECT tm.project_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_tasks' AND policyname = 'Project members can view tasks') THEN
    CREATE POLICY "Project members can view tasks"
      ON public.project_tasks
      FOR SELECT
      USING (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR project_id IN (
          SELECT tm.project_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_tasks' AND policyname = 'Project members can manage tasks') THEN
    CREATE POLICY "Project members can manage tasks"
      ON public.project_tasks
      FOR ALL
      USING (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR project_id IN (
          SELECT tm.project_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
        )
      )
      WITH CHECK (
        project_id IN (
          SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
        OR project_id IN (
          SELECT tm.project_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
        )
      );
  END IF;
END $$;
