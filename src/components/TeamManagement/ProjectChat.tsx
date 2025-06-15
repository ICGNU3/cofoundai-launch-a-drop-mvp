
import React, { useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Props = {
  projectId: string;
  teamMemberId?: string | null;
};

export const ProjectChat: React.FC<Props> = ({ projectId, teamMemberId }) => {
  const { toast } = useToast();
  const [message, setMessage] = React.useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { data: messages = [], refetch } = useQuery({
    queryKey: ["team-chat", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!message.trim()) return;
      const { error } = await supabase.from("team_messages").insert({
        project_id: projectId,
        team_member_id: teamMemberId,
        content: message.trim(),
      });
      if (error) throw error;
      setMessage("");
      return true;
    },
    onSuccess: () => {
      refetch();
    },
    onError: (err: any) => {
      toast({ title: "Message Send Failed", description: err.message || "Try again" });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
      }, 100);
    }
  }, [messages.length]);

  return (
    <div className="border bg-card rounded-lg p-4 max-w-2xl mx-auto">
      <h3 className="font-bold mb-2">Project Chat</h3>
      <div
        className="overflow-y-auto mb-2 p-2 bg-zinc-950 rounded min-h-[120px] max-h-[240px]"
        style={{ scrollbarGutter: "stable" }}
        ref={scrollRef}
      >
        {messages.length === 0 ? (
          <div className="text-zinc-400 text-sm">No messages yet. Be the first to say hello!</div>
        ) : (
          messages.map((msg: any) => (
            <div key={msg.id} className="mb-1">
              <span className="font-bold text-accent">{msg.team_member_id ? msg.team_member_id.slice(0, 4) : "🔔"}</span>
              <span className="ml-2">{msg.content}</span>
              <span className="ml-3 text-xs text-zinc-500">{new Date(msg.created_at).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          sendMutation.mutate();
        }}
        className="flex gap-2"
      >
        <input
          className="flex-1 p-2 border rounded"
          value={message}
          placeholder="Send a message to your team"
          onChange={e => setMessage(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-accent text-white rounded hover:scale-105 transition"
          type="submit"
          disabled={!message.trim() || sendMutation.isPending}
        >
          Send
        </button>
      </form>
    </div>
  );
};
