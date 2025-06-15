
-- 1. Update RLS for projects table to allow access by wallet_address in addition to owner_id == auth.uid()
DROP POLICY IF EXISTS "Owner can access their projects" ON public.projects;
CREATE POLICY "Owner or wallet can access their projects"
  ON public.projects
  USING (
    owner_id = auth.uid()
    OR (
      wallet_address IS NOT NULL
      AND wallet_address = (auth.jwt() ->> 'wallet_address')
    )
  )
  WITH CHECK (
    owner_id = auth.uid()
    OR (
      wallet_address IS NOT NULL
      AND wallet_address = (auth.jwt() ->> 'wallet_address')
    )
  );


-- 2. Do the same for project_roles
DROP POLICY IF EXISTS "Owner can access roles" ON public.project_roles;
CREATE POLICY "Owner or wallet can access roles"
  ON public.project_roles
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE
        owner_id = auth.uid()
        OR (
          wallet_address IS NOT NULL
          AND wallet_address = (auth.jwt() ->> 'wallet_address')
        )
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects WHERE
        owner_id = auth.uid()
        OR (
          wallet_address IS NOT NULL
          AND wallet_address = (auth.jwt() ->> 'wallet_address')
        )
    )
  );


-- 3. And for project_expenses
DROP POLICY IF EXISTS "Owner can access expenses" ON public.project_expenses;
CREATE POLICY "Owner or wallet can access expenses"
  ON public.project_expenses
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE
        owner_id = auth.uid()
        OR (
          wallet_address IS NOT NULL
          AND wallet_address = (auth.jwt() ->> 'wallet_address')
        )
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects WHERE
        owner_id = auth.uid()
        OR (
          wallet_address IS NOT NULL
          AND wallet_address = (auth.jwt() ->> 'wallet_address')
        )
    )
  );


-- 4. Repeat for project_analytics
DROP POLICY IF EXISTS "Owner can access analytics" ON public.project_analytics;
CREATE POLICY "Owner or wallet can access analytics"
  ON public.project_analytics
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE
        owner_id = auth.uid()
        OR (
          wallet_address IS NOT NULL
          AND wallet_address = (auth.jwt() ->> 'wallet_address')
        )
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects WHERE
        owner_id = auth.uid()
        OR (
          wallet_address IS NOT NULL
          AND wallet_address = (auth.jwt() ->> 'wallet_address')
        )
    )
  );


-- 5. Do the same type of policy for project_collaborators, team_members, team_invitations, and role_permissions if needed.

-- NOTE: For wallet- or custom-external-auth support, your authentication system MUST include a 'wallet_address' claim in the user's JWT.
--       If in the future you have a different user-object/claim, adjust accordingly.

