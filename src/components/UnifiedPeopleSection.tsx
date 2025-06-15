
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePrivy } from "@privy-io/react-auth";
import { AccentButton } from "@/components/ui/AccentButton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * Shows all "people" related to a project: active team members, pending invitations (from both sources).
 * Allows inviting by email or wallet, and shows roles/status.
 */
type UnifiedPeopleSectionProps = {
  projectId: string;
  projectOwnerId: string;
};

export const UnifiedPeopleSection: React.FC<UnifiedPeopleSectionProps> = ({
  projectId,
  projectOwnerId,
}) => {
  const { user } = usePrivy();
  const { toast } = useToast();
  const [inviteMode, setInviteMode] = useState<null | "email" | "wallet">(null);
  const [inviteValue, setInviteValue] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [inviting, setInviting] = useState(false);

  // Fetch merged "team members" (accepted/joined)
  const { data: teamMembers = [], refetch: refetchTeam } = useQuery({
    queryKey: ["team-members", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("project_id", projectId);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch pending invitations from both sources
  const { data: allInvites = [], refetch: refetchInvites } = useQuery({
    queryKey: ["unified-invites", projectId],
    queryFn: async () => {
      // Get pending team_invitations
      const { data: ti, error: tiErr } = await supabase
        .from("team_invitations")
        .select("*")
        .eq("project_id", projectId)
        .eq("status", "pending");
      if (tiErr) throw tiErr;
      // Get pending project_collaborators
      const { data: pc, error: pcErr } = await supabase
        .from("project_collaborators")
        .select("*")
        .eq("project_id", projectId)
        .eq("status", "pending");
      if (pcErr) throw pcErr;

      // Normalize both types for display
      const tiNorm = (ti || []).map((x: any) => ({
        ...x,
        type: "team",
        label: x.invited_email || x.invited_wallet || "N/A",
        role: x.assigned_role || "-",
      }));
      const pcNorm = (pc || []).map((x: any) => ({
        ...x,
        type: "collaborator",
        label: x.invited_email || x.invited_wallet || "N/A",
        role: "-", // collaborators invites don't have role info
      }));

      return [...tiNorm, ...pcNorm];
    },
  });

  // Unified inviting handler: team_invitations will require a role; project_collaborators won't.
  const handleSendInvite = async () => {
    setInviting(true);
    try {
      if (!inviteMode || !inviteValue) return;
      if (!user?.id) {
        toast({ title: "Not signed in", description: "Please sign in to invite." });
        setInviting(false);
        return;
      }
      // If role specified, treat as team_invitations
      if (inviteRole) {
        const { error } = await supabase.from("team_invitations").insert({
          project_id: projectId,
          invited_by: user.id,
          [`invited_${inviteMode}`]: inviteValue,
          assigned_role: inviteRole,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("project_collaborators").insert({
          project_id: projectId,
          invited_by: user.id,
          [`invited_${inviteMode}`]: inviteValue,
        });
        if (error) throw error;
      }
      setInviteValue("");
      setInviteRole("");
      setInviteMode(null);
      toast({ title: "Invite sent" });
      refetchInvites();
      refetchTeam();
    } catch (e: any) {
      toast({ title: "Error", description: e?.message ?? "Failed to send invite." });
    }
    setInviting(false);
  };

  return (
    <section className="mb-10 border border-border rounded-lg bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">People</h2>
        {user?.id === projectOwnerId && (
          <AccentButton className="text-base" onClick={() => setInviteMode(inviteMode ? null : "email")}>
            + Invite
          </AccentButton>
        )}
      </div>

      {/* People directory: accepted/active team members */}
      <div className="mb-3 font-semibold">Active Members</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {teamMembers.length > 0 ? (
          teamMembers.map((tm: any) => (
            <div key={tm.id} className={cn("rounded-lg p-4 border flex flex-col gap-1 bg-card",
              tm.status !== "active" && "opacity-60")}>
              <div className="flex gap-2 items-center">
                <div className="rounded-full w-8 h-8 bg-zinc-900 flex items-center justify-center text-lg font-bold uppercase">
                  {tm.invited_email
                    ? tm.invited_email[0]
                    : tm.wallet_address
                      ? tm.wallet_address.slice(2, 4)
                      : "M"}
                </div>
                <div>
                  <div className="font-semibold">{tm.invited_email || tm.wallet_address || "Wallet"}</div>
                  <div className="text-xs text-zinc-400">{tm.assigned_role || "-"}</div>
                </div>
                <div className="ml-auto">
                  <span
                    className={cn("px-2 py-0.5 rounded-full text-xs",
                      tm.status === "active"
                        ? "bg-green-100 text-green-700"
                        : tm.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-zinc-300 text-zinc-500"
                    )}
                  >
                    {tm.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-zinc-400">No active team members yet.</div>
        )}
      </div>

      {/* Show pending invites (from both tables) */}
      {allInvites.length > 0 && (
        <>
          <div className="mb-2 font-semibold">Pending Invitations</div>
          <ul className="space-y-2 mb-5">
            {allInvites.map((inv: any) => (
              <li key={inv.id} className="flex items-center gap-2 border-b border-border py-2 last:border-b-0 opacity-80">
                <span className="font-mono text-sm text-body-text">{inv.label}</span>
                <span className="text-xs text-zinc-400">{inv.role}</span>
                <span className="px-2 py-0.5 rounded-full text-xs ml-2 bg-yellow-100 text-yellow-700">Pending</span>
                {inv.type === "team" && (
                  <span className="text-xs ml-2">(Team Invite)</span>
                )}
                {inv.type === "collaborator" && (
                  <span className="text-xs ml-2">(Collaborator)</span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Invite form */}
      {user?.id === projectOwnerId && inviteMode && (
        <div className="border rounded-lg bg-card p-4 mb-5">
          <div className="mb-3 font-semibold">Invite</div>
          <div className="flex gap-3 mb-2">
            <button
              className={cn("px-3 py-1 rounded", inviteMode === "email" ? "bg-accent/30" : "bg-zinc-200")}
              onClick={() => setInviteMode("email")}
            >
              Invite by Email
            </button>
            <button
              className={cn("px-3 py-1 rounded", inviteMode === "wallet" ? "bg-accent/30" : "bg-zinc-200")}
              onClick={() => setInviteMode("wallet")}
            >
              Invite by Wallet Address
            </button>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-3">
            <input
              className="p-2 border rounded flex-1"
              placeholder={inviteMode === "email" ? "Email address" : "0xWallet..."}
              value={inviteValue}
              onChange={(e) => setInviteValue(e.target.value)}
            />
            <input
              className="p-2 border rounded flex-1"
              placeholder="Role (optional)"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
            />
            <AccentButton onClick={handleSendInvite} className="px-6 py-2" disabled={inviting}>
              {inviting ? "Sending..." : "Send Invite"}
            </AccentButton>
          </div>
        </div>
      )}
    </section>
  );
};

export default UnifiedPeopleSection;
