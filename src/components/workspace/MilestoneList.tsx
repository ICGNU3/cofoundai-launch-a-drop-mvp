
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type MilestoneListProps = {
  projectId: string;
};

export const MilestoneList: React.FC<MilestoneListProps> = ({ projectId }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", due_date: "" });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_milestones")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const addMilestone = useMutation({
    mutationFn: async (f: typeof form) => {
      const { error } = await supabase.from("project_milestones").insert({
        project_id: projectId,
        title: f.title,
        description: f.description,
        due_date: f.due_date ? f.due_date : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Milestone Added" });
      setShowForm(false);
      setForm({ title: "", description: "", due_date: "" });
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
    },
    onError: () => toast({ title: "Failed to add milestone", variant: "destructive" }),
  });

  const completeMilestone = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_milestones").update({ is_completed: true, completed_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      toast({ title: "Milestone completed" });
    },
  });

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-2">Milestones</h2>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "Add Milestone"}</Button>
      </div>
      {showForm && (
        <form
          className="bg-card p-4 rounded border mb-4 space-y-3"
          onSubmit={e => {
            e.preventDefault();
            addMilestone.mutate(form);
          }}
        >
          <input required placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full p-2 rounded border" />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full p-2 rounded border" rows={3} />
          <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className="p-2 rounded border" />
          <Button type="submit">Create Milestone</Button>
        </form>
      )}
      {isLoading ? (
        <div>Loading milestones...</div>
      ) : (
        <div className="space-y-2">
          {milestones.length === 0 && <span className="text-sm text-zinc-400">No milestones defined yet.</span>}
          {milestones.map((ms: any) => (
            <div key={ms.id} className="bg-background border rounded px-4 py-3 flex flex-col gap-1">
              <span className="font-medium">{ms.title}</span>
              <span className="text-xs text-zinc-500">{ms.description}</span>
              {ms.due_date && <span className="text-xs text-purple-600">Due: {ms.due_date}</span>}
              <div className="flex gap-2 mt-1">
                {ms.is_completed ? <span className="text-green-600 text-xs">Completed</span> : (
                  <Button size="sm" variant="outline" onClick={() => completeMilestone.mutate(ms.id)}>Mark as Completed</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
