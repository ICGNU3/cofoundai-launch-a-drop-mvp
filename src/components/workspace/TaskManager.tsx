import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { taskSchema, sanitize } from "@/utils/validation";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  deadline: string | null;
  assigned_to_team_member: string | null;
  assigned_role: string | null;
};

type TaskManagerProps = {
  projectId: string;
};

export const TaskManager: React.FC<TaskManagerProps> = ({ projectId }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ title: string; description: string; deadline: string; status: string }>({ title: "", description: "", deadline: "", status: "todo" });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const addTask = useMutation({
    mutationFn: async (t: typeof form) => {
      const validated = taskSchema.safeParse(t);
      if (!validated.success) throw new Error("Invalid task input.");
      const clean = {
        ...validated.data,
        title: sanitize(validated.data.title),
        description: sanitize(validated.data.description),
      };
      const { error } = await supabase.from("project_tasks").insert({
        project_id: projectId,
        ...clean,
        deadline: clean.deadline ? clean.deadline : null,
      });
      if (error) throw new Error("Failed to create task.");
    },
    onSuccess: () => {
      toast({ title: "Task Created" });
      setShowForm(false);
      setForm({ title: "", description: "", deadline: "", status: "todo" });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
    onError: () => toast({ title: "Failed to create task. Please check input.", variant: "destructive" }),
  });

  const setTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("project_tasks").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-2">Tasks</h2>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "Add Task"}</Button>
      </div>
      {showForm && (
        <form
          className="bg-card p-4 rounded border mb-4 space-y-3"
          onSubmit={e => {
            e.preventDefault();
            addTask.mutate(form);
          }}
        >
          <input required placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full p-2 rounded border" />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full p-2 rounded border" rows={3} />
          <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="p-2 rounded border" />
          <Button type="submit">Create Task</Button>
        </form>
      )}
      {isLoading ? (
        <div>Loading tasks...</div>
      ) : (
        <div className="space-y-3">
          {["todo", "in-progress", "completed"].map((status) => (
            <div key={status}>
              <div className="font-semibold capitalize mb-1">{status.replace("-", " ")}</div>
              <div className="flex flex-col gap-2">
                {tasks.filter((t: Task) => t.status === status).length === 0 && (
                  <span className="text-sm text-zinc-400">No tasks</span>
                )}
                {tasks
                  .filter((t: Task) => t.status === status)
                  .map((task: Task) => (
                    <div key={task.id} className="bg-background border rounded px-4 py-2 flex flex-col gap-1">
                      <span className="font-medium">{task.title}</span>
                      <span className="text-xs text-zinc-500">{task.description}</span>
                      {task.deadline && <span className="text-xs text-purple-600">Deadline: {task.deadline}</span>}
                      <div className="flex gap-2 mt-1">
                        {["todo", "in-progress", "completed"].filter(s => s !== task.status).map((s) => (
                          <Button
                            key={s}
                            size="sm"
                            variant="outline"
                            onClick={() => setTaskStatus.mutate({ id: task.id, status: s })}
                          >
                            Mark as {s.replace("-", " ")}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
