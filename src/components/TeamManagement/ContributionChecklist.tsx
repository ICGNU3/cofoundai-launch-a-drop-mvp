
import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AccentButton } from "@/components/ui/AccentButton";

type Props = {
  teamMemberId: string;
  projectId: string;
};

export const ContributionChecklist: React.FC<Props> = ({ teamMemberId, projectId }) => {
  const { toast } = useToast();
  const { data: checklist = [], refetch } = useQuery({
    queryKey: ["contributions", teamMemberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contribution_checklists")
        .select("*")
        .eq("team_member_id", teamMemberId)
        .eq("project_id", projectId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!teamMemberId && !!projectId,
  });

  const updateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contribution_checklists")
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast({ title: "Contribution complete!", description: "Marked as completed." });
      refetch();
    }
  });

  return (
    <div>
      <h4 className="font-semibold mb-1 text-base">Your Contributions</h4>
      <ul className="mb-2">
        {checklist.length === 0 && <li className="text-zinc-400 text-sm">No contributions assigned.</li>}
        {checklist.map((item: any) => (
          <li key={item.id} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={item.is_completed}
              onChange={() => !item.is_completed && updateMutation.mutate(item.id)}
              className="cursor-pointer accent-accent"
            />
            <span className={item.is_completed ? "line-through text-zinc-500" : ""}>
              {item.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
