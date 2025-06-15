
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch full aggregated project data: project, roles, team, invites.
 */
export const useProjectFullData = (projectId?: string | null) => {
  return useQuery({
    queryKey: ["project-full-data", projectId],
    queryFn: async () => {
      if (!projectId) return null;

      // 1. Project details:
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .maybeSingle();
      if (projectError) throw projectError;
      if (!project) return null;

      // 2. Roles
      const { data: roles, error: rolesError } = await supabase
        .from("project_roles")
        .select("*")
        .eq("project_id", projectId);
      if (rolesError) throw rolesError;

      // 3. Expenses
      const { data: expenses, error: expensesError } = await supabase
        .from("project_expenses")
        .select("*")
        .eq("project_id", projectId);
      if (expensesError) throw expensesError;

      // 4. Analytics
      const { data: analytics, error: analyticsError } = await supabase
        .from("project_analytics")
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle();
      if (analyticsError) throw analyticsError;

      // 5. Team members
      const { data: teamMembers, error: teamError } = await supabase
        .from("team_members")
        .select("*")
        .eq("project_id", projectId);
      if (teamError) throw teamError;

      // 6. Pending invites from both tables
      const { data: teamInvites, error: tInviteError } = await supabase
        .from("team_invitations")
        .select("*")
        .eq("project_id", projectId)
        .eq("status", "pending");
      if (tInviteError) throw tInviteError;

      const { data: collabInvites, error: cInviteError } = await supabase
        .from("project_collaborators")
        .select("*")
        .eq("project_id", projectId)
        .eq("status", "pending");
      if (cInviteError) throw cInviteError;

      // Aggregate results
      return {
        ...project,
        roles: roles || [],
        expenses: expenses || [],
        analytics: analytics || {},
        teamMembers: teamMembers || [],
        invites: [
          ...(teamInvites || []).map((x: any) => ({
            ...x,
            type: "team",
            label: x.invited_email || x.invited_wallet || "N/A",
            role: x.assigned_role || "-",
          })),
          ...(collabInvites || []).map((x: any) => ({
            ...x,
            type: "collaborator",
            label: x.invited_email || x.invited_wallet || "N/A",
            role: "-",
          })),
        ],
      };
    },
    enabled: !!projectId,
  });
};
