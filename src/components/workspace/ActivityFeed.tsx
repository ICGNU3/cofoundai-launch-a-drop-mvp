
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ActivityFeedProps = {
  projectId: string;
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ projectId }) => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["activity-log", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_activity_log")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
    refetchInterval: 10000, // 10s polling for updates
  });

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Activity Feed</h2>
      {isLoading ? (
        <div>Loading activity...</div>
      ) : (
        <div className="space-y-2">
          {events.length === 0 && <span className="text-sm text-zinc-400">No recorded activity yet.</span>}
          {events.map((evt: any) => (
            <div key={evt.id} className="bg-background border rounded px-4 py-2 flex flex-col">
              <span className="text-xs text-accent font-mono">{evt.activity_type}</span>
              <span className="text-xs">{evt.activity_description}</span>
              <span className="text-xxs text-muted-foreground">{new Date(evt.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
