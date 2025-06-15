import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { threadSchema, sanitize } from "@/utils/validation";

type DiscussionThreadsProps = {
  projectId: string;
};

export const DiscussionThreads: React.FC<DiscussionThreadsProps> = ({ projectId }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: threads = [], isLoading } = useQuery({
    queryKey: ["threads", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_discussion_threads")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["thread-messages", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_discussion_messages")
        .select("*")
        .in("thread_id", threads.map((t: any) => t.id));
      if (error) throw error;
      return data;
    },
    enabled: threads.length > 0,
  });

  const addThread = useMutation({
    mutationFn: async (f: typeof form) => {
      const validated = threadSchema.safeParse(f);
      if (!validated.success) throw new Error("Invalid thread input.");
      const clean = {
        ...validated.data,
        title: sanitize(validated.data.title),
        content: sanitize(validated.data.content),
      };
      const { data, error } = await supabase
        .from("project_discussion_threads")
        .insert({
          project_id: projectId,
          title: clean.title,
        })
        .select()
        .single();
      if (error) throw error;
      if (clean.content) {
        await supabase.from("project_discussion_messages").insert({
          thread_id: data.id,
          content: clean.content,
        });
      }
      return data;
    },
    onSuccess: () => {
      toast({ title: "Thread created" });
      setShowForm(false);
      setForm({ title: "", content: "" });
      queryClient.invalidateQueries({ queryKey: ["threads", projectId] });
      queryClient.invalidateQueries({ queryKey: ["thread-messages", projectId] });
    },
    onError: () => toast({ title: "Thread creation failed. Please check your fields.", variant: "destructive" }),
  });

  const addReply = useMutation({
    mutationFn: async ({ threadId, content }: { threadId: string; content: string }) => {
      const cleanContent = sanitize(content);
      if (!cleanContent || cleanContent.length > 1000) throw new Error("Invalid reply length.");
      const { error } = await supabase.from("project_discussion_messages").insert({
        thread_id: threadId,
        content: cleanContent,
      });
      if (error) throw new Error("Failed to post reply.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thread-messages", projectId] });
      toast({ title: "Reply posted" });
    },
    onError: () => toast({ title: "Failed to post reply. Please check your content.", variant: "destructive" }),
  });

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-2">Discussion Threads</h2>
        <Button onClick={() => setShowForm(v => !v)}>{showForm ? "Cancel" : "New Thread"}</Button>
      </div>
      {showForm && (
        <form
          className="bg-card p-4 rounded border mb-4 space-y-3"
          onSubmit={e => {
            e.preventDefault();
            addThread.mutate(form);
          }}
        >
          <input required placeholder="Thread Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full p-2 rounded border" />
          <textarea placeholder="Discussion content (optional)" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="w-full p-2 rounded border" rows={3} />
          <Button type="submit">Create Thread</Button>
        </form>
      )}
      {isLoading ? (
        <div>Loading threads...</div>
      ) : (
        <div className="space-y-4">
          {threads.length === 0 && <span className="text-sm text-zinc-400">No threads yet.</span>}
          {threads.map((thread: any) => (
            <div key={thread.id} className="bg-background border rounded px-4 py-3">
              <div className="font-bold text-accent">{thread.title}</div>
              <div className="ml-2 mt-2 space-y-2">
                {messages.filter((msg: any) => msg.thread_id === thread.id).map((msg: any) => (
                  <div key={msg.id} className="text-xs border rounded p-2">
                    {msg.content}{" "}
                    <span className="ml-2 text-xxs text-zinc-500">{msg.created_at && new Date(msg.created_at).toLocaleString()}</span>
                  </div>
                ))}
                <ReplyBox
                  onReply={content => addReply.mutate({ threadId: thread.id, content })}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// Inline reply box component for sending replies
const ReplyBox: React.FC<{ onReply: (content: string) => void }> = ({ onReply }) => {
  const [content, setContent] = useState("");
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (content.trim()) {
          onReply(content);
          setContent("");
        }
      }}
      className="flex gap-2 items-center mt-2"
    >
      <input
        value={content}
        onChange={e => setContent(e.target.value)}
        className="flex-1 border rounded px-2 py-1 text-xs"
        placeholder="Write a reply"
      />
      <button type="submit" className="px-2 py-1 bg-accent text-white rounded text-xs">
        Reply
      </button>
    </form>
  );
};
