
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CollaboratorInviteModal } from "./CollaboratorInviteModal";

interface CollaboratorsSectionProps {
  projectId: string;
}

export const CollaboratorsSection: React.FC<CollaboratorsSectionProps> = ({ projectId }) => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [forceReload, setForceReload] = useState(0);

  // Load collaborators
  const { data: collaborators, refetch: refetchCollaborators } = useQuery({
    queryKey: ["collaborators", projectId, forceReload],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("project_collaborators")
        .select("*")
        .eq("project_id", projectId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-body-text mb-0">Collaborators</h3>
        <button
          className="bg-accent px-4 py-2 rounded-full text-white text-sm shadow hover:bg-opacity-80"
          onClick={() => setInviteOpen(true)}
        >
          + Invite Collaborator
        </button>
      </div>
      <ul className="space-y-2">
        {collaborators && collaborators.length > 0 ? (
          collaborators.map((c: any) => (
            <li key={c.id} className="flex items-center gap-2 border-b border-border py-2 last:border-b-0">
              <span className="font-mono text-sm text-body-text">
                {c.invited_email || c.invited_wallet}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs ml-2
                ${c.status === "accepted"
                  ? "bg-green-100 text-green-600"
                  : c.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-500"
                }`}>
                {c.status}
              </span>
              {c.accepted_at && <span className="text-xs ml-2">(joined)</span>}
            </li>
          ))
        ) : (
          <li className="text-zinc-400">No collaborators yet.</li>
        )}
      </ul>
      <CollaboratorInviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        projectId={projectId}
        onInvited={() => {
          setInviteOpen(false);
          setForceReload(x => x + 1);
          refetchCollaborators();
        }}
      />
    </div>
  );
};
