
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ProjectFilesProps = {
  projectId: string;
};

export const ProjectFiles: React.FC<ProjectFilesProps> = ({ projectId }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ filename: "", url: "", description: "" });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["files", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_files")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const addFile = useMutation({
    mutationFn: async (f: typeof form) => {
      const { error } = await supabase.from("project_files").insert({
        project_id: projectId,
        filename: f.filename,
        url: f.url,
        description: f.description,
        file_type: "", // extend as needed for real file uploads
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "File Added" });
      setShowForm(false);
      setForm({ filename: "", url: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["files", projectId] });
    },
    onError: () => toast({ title: "Failed to add file", variant: "destructive" }),
  });

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-2">Files & Links</h2>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "Add File/Link"}</Button>
      </div>
      {showForm && (
        <form
          className="bg-card p-4 rounded border mb-4 space-y-3"
          onSubmit={e => {
            e.preventDefault();
            addFile.mutate(form);
          }}
        >
          <input required placeholder="Filename or Asset Name" value={form.filename} onChange={e => setForm(f => ({ ...f, filename: e.target.value }))} className="w-full p-2 rounded border" />
          <input required placeholder="File URL or Link" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} className="w-full p-2 rounded border" type="url" />
          <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full p-2 rounded border" rows={2} />
          <Button type="submit">Add</Button>
        </form>
      )}
      {isLoading ? (
        <div>Loading files...</div>
      ) : (
        <div className="space-y-2">
          {files.length === 0 && <span className="text-sm text-zinc-400">No files or links shared yet.</span>}
          {files.map((file: any) => (
            <div key={file.id} className="bg-background border rounded p-3">
              <div className="font-medium">{file.filename}</div>
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-xs break-all">{file.url}</a>
              {file.description && <div className="text-xs mt-1 text-zinc-600">{file.description}</div>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
