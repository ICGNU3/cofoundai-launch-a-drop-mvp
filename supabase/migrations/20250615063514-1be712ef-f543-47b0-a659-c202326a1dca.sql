
-- Table to store collaborators invited to a project
CREATE TABLE public.project_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  invited_email TEXT,
  invited_wallet TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, declined, removed
  invited_by UUID, -- user ID (owner or existing collaborator)
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;

-- Policy: Project owner (and accepted collaborators) can see entries linked to their projects
CREATE POLICY "Project members can view their collaborators"
  ON public.project_collaborators
  FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
    OR invited_by = auth.uid()
    OR (invited_email IS NOT NULL AND invited_email = auth.jwt() ->> 'email')
    -- Optionally: Allow by wallet address if you want full decentralization
  );

-- Policy: Only project owner (or system) can insert invites
CREATE POLICY "Owner can invite collaborators"
  ON public.project_collaborators
  FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

-- Policy: Invited collaborators can update their own invite (accept/decline)
CREATE POLICY "Collaborator can update invite status"
  ON public.project_collaborators
  FOR UPDATE
  USING (
    (invited_email IS NOT NULL AND invited_email = auth.jwt() ->> 'email')
    OR invited_by = auth.uid()
  );

-- Policy: Project owner can remove any collaborator
CREATE POLICY "Owner can remove collaborators"
  ON public.project_collaborators
  FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

