
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  projectId: string;
  currentUserId: string | null;
  userIsOwner: boolean;
};

export const RolePermissionsPanel: React.FC<Props> = ({ projectId, currentUserId, userIsOwner }) => {
  const { data: perms = [] } = useQuery({
    queryKey: ["role-permissions", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("role_permissions")
        .select("*")
        .eq("project_id", projectId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });

  // Group by role
  const permsByRole = React.useMemo(() => {
    const byRole: Record<string, string[]> = {};
    perms.forEach((p: any) => {
      if (!byRole[p.role_name]) byRole[p.role_name] = [];
      byRole[p.role_name].push(p.permission);
    });
    return byRole;
  }, [perms]);

  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-2">Role Permissions (RBAC)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(permsByRole).map(([role, pList]) => (
          <div key={role} className="border bg-card rounded p-3">
            <div className="font-semibold mb-2">{role}</div>
            <ul className="list-disc ml-5 text-sm">
              {pList.map((perm) => (
                <li key={perm}>{perm}</li>
              ))}
            </ul>
          </div>
        ))}
        {Object.keys(permsByRole).length === 0 && (
          <div className="text-zinc-400 col-span-2">No role permissions defined for this project.</div>
        )}
      </div>
      {!userIsOwner && (
        <div className="text-xs text-zinc-500 mt-2">Only project owners can edit permissions.</div>
      )}
    </section>
  );
};
