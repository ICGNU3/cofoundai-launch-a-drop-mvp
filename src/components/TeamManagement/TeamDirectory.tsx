
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AccentButton } from "@/components/ui/AccentButton";
import { cn } from "@/lib/utils";

type Props = {
  projectId: string;
  projectOwnerId: string;
  currentUserId: string | null;
};

export const TeamDirectory: React.FC<Props> = ({ projectId, projectOwnerId, currentUserId }) => {
  const { toast } = useToast();
  const [inviteMode, setInviteMode] = useState<null | "email" | "wallet">(null);
  const [inviteValue, setInviteValue] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingMemberId, setOnboardingMemberId] = useState<string | null>(null);

  // Fetch team members (accepted)
  const { data: teamMembers = [], refetch } = useQuery({
    queryKey: ["team-members", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("project_id", projectId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });

  // Fetch invitations
  const { data: invites = [] } = useQuery({
    queryKey: ["team-invitations", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_invitations")
        .select("*")
        .eq("project_id", projectId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });

  // Invite mutation
  const inviteMutation = useMutation({
    mutationFn: async ({
      mode,
      value,
      role,
    }: {
      mode: "email" | "wallet";
      value: string;
      role: string;
    }) => {
      const { error } = await supabase.from("team_invitations").insert({
        project_id: projectId,
        invited_by: currentUserId,
        [`invited_${mode}`]: value,
        assigned_role: role,
      });
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast({ title: "Invite Sent", description: "Team invitation sent successfully." });
      setInviteValue("");
      setInviteRole("");
      setInviteMode(null);
      refetch();
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to send invite." });
    },
  });

  function handleInvite() {
    if (!inviteMode || !inviteValue || !inviteRole) return;
    inviteMutation.mutate({ mode: inviteMode, value: inviteValue, role: inviteRole });
  }

  // Show onboarding for current user if they're pending
  React.useEffect(() => {
    if (!currentUserId) return;
    const member = teamMembers.find(
      (tm) => tm.user_id === currentUserId && tm.status === "pending"
    );
    if (member) {
      setOnboardingMemberId(member.id);
      setShowOnboarding(true);
    }
  }, [currentUserId, teamMembers]);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Team Directory</h2>
        {currentUserId === projectOwnerId && (
          <AccentButton className="text-base" onClick={() => setInviteMode(inviteMode ? null : "email")}>
            + Invite Member
          </AccentButton>
        )}
      </div>
      {/* Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {teamMembers.map((tm: any) => (
          <div
            key={tm.id}
            className={cn(
              "rounded-lg p-4 border flex flex-col gap-1 bg-card",
              tm.status !== "active" && "opacity-60"
            )}
          >
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
                <div className="text-xs text-zinc-400">{tm.assigned_role}</div>
              </div>
              <div className="ml-auto">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
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
            {/* Onboard button */}
            {tm.status === "pending" && currentUserId === tm.user_id && (
              <button
                className="mt-2 accent-btn"
                onClick={() => {
                  setOnboardingMemberId(tm.id);
                  setShowOnboarding(true);
                }}
              >
                Start Onboarding
              </button>
            )}
          </div>
        ))}
        {/* Show pending invites */}
        {invites
          .filter((inv: any) => !teamMembers.some((tm: any) => tm.invited_email === inv.invited_email && tm.assigned_role === inv.assigned_role))
          .map((inv: any) => (
            <div
              key={inv.id}
              className="rounded-lg p-4 border bg-card opacity-70 flex flex-col gap-1"
            >
              <div className="flex gap-2 items-center">
                <div className="rounded-full w-8 h-8 bg-zinc-900 flex items-center justify-center text-lg font-bold uppercase">
                  {inv.invited_email ? inv.invited_email[0] : inv.invited_wallet?.slice(2, 4)}
                </div>
                <div>
                  <div className="font-semibold">{inv.invited_email || inv.invited_wallet || "Wallet"}</div>
                  <div className="text-xs text-zinc-400">{inv.assigned_role}</div>
                </div>
                <div className="ml-auto">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">
                    Pending Invitation
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Invite form */}
      {currentUserId === projectOwnerId && inviteMode && (
        <div className="border rounded-lg bg-card p-4 mb-5">
          <div className="mb-3 font-semibold">Invite Team Member</div>
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
              placeholder="Role (e.g. Developer)"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
            />
            <AccentButton onClick={handleInvite} className="px-6 py-2">
              Send Invite
            </AccentButton>
          </div>
        </div>
      )}

      {/* Personalized Onboarding */}
      {showOnboarding && onboardingMemberId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-xl shadow-2xl p-4 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 bg-card rounded-full p-3 text-xl"
              onClick={() => setShowOnboarding(false)}
            >
              ✕
            </button>
            <OnboardingModal teamMemberId={onboardingMemberId} onComplete={() => setShowOnboarding(false)} />
          </div>
        </div>
      )}
    </section>
  );
};

import { OnboardingModal } from "./OnboardingModal";
