
import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AccentButton } from "@/components/ui/AccentButton";

type Props = {
  teamMemberId: string;
  onComplete: () => void;
};

export const OnboardingModal: React.FC<Props> = ({ teamMemberId, onComplete }) => {
  const { toast } = useToast();

  // Fetch team member details (incl. role)
  const { data: teamMember } = useQuery({
    queryKey: ["team-member", teamMemberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("id", teamMemberId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!teamMemberId,
  });

  // Fetch onboarding steps for role
  const { data: steps = [] } = useQuery({
    queryKey: ["onboarding-steps", teamMember?.assigned_role, teamMember?.project_id],
    queryFn: async () => {
      if (!teamMember) return [];
      // Steps defined for the role, optionally scoped to project
      const { data: stepsP } = await supabase
        .from("onboarding_steps")
        .select("*")
        .eq("role_name", teamMember.assigned_role)
        .or(`project_id.eq.${teamMember.project_id},project_id.is.null`)
        .order("step_order", { ascending: true });
      return stepsP || [];
    },
    enabled: !!teamMember?.assigned_role,
  });

  // Mark onboarding as complete
  const completeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("team_members")
        .update({ onboarded: true, status: "active", joined_at: new Date().toISOString() })
        .eq("id", teamMemberId);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Onboarding Complete!",
        description: "Welcome aboard. You're now active on this project.",
      });
      onComplete();
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Onboarding failed." });
    },
  });

  if (!teamMember) return <div>Loading onboarding...</div>;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-bold text-lg mb-2">Welcome, {teamMember.invited_email || teamMember.wallet_address || "Team Member"}!</h3>
      <div className="text-sm mb-1">Role: <b>{teamMember.assigned_role}</b></div>
      {steps.length > 0 ? (
        <div>
          <div className="mb-1 font-semibold">Your Onboarding Steps:</div>
          <ol className="list-decimal ml-6 mb-3">
            {steps.map((s: any) => (
              <li key={s.id} className="mb-2"><b>{s.step_title}</b> <div className="text-xs text-zinc-400">{s.step_description}</div></li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="text-zinc-500 mb-4">No specific onboarding steps for your role.</div>
      )}
      <AccentButton
        className="mt-4"
        onClick={() => completeMutation.mutate()}
        disabled={teamMember.onboarded || completeMutation.isPending}
      >
        {teamMember.onboarded ? "Onboarding Complete" : "Mark Onboarding Complete"}
      </AccentButton>
    </div>
  );
};
