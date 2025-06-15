
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePrivy } from "@privy-io/react-auth";
import { Link } from "react-router-dom";

type Project = {
  id: string;
  project_idea: string;
  project_type: string;
  minted_at: string | null;
  funding_total: number | null;
  funding_target: number | null;
  zora_coin_url: string | null;
  cover_art_url: string | null;
};

const Dashboard: React.FC = () => {
  const { user, ready } = usePrivy();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["my-projects", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_id", user.id)
        .order("minted_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-8 px-4">
      <h1 className="text-3xl font-bold mb-4">My Drops Dashboard</h1>
      {isLoading && <div>Loading...</div>}
      <div className="max-w-3xl w-full">
        <div className="w-full mb-6 flex justify-end">
          <Link
            to="/"
            className="bg-accent px-4 py-2 rounded-full text-white text-sm shadow hover:bg-opacity-80 transition"
          >+ Launch New Drop</Link>
        </div>
        <div>
          {projects && projects.length > 0 ? (
            <ul className="w-full grid gap-6">
              {projects.map((proj: Project) => (
                <li key={proj.id}>
                  <Link to={`/project/${proj.id}`} className="block rounded-lg border bg-card hover:shadow-lg transition p-6 relative">
                    <div className="flex">
                      {proj.cover_art_url ? (
                        <img src={proj.cover_art_url} className="w-20 h-20 rounded-md mr-5 object-cover" alt="cover" />
                      ) : (
                        <div className="w-20 h-20 rounded-md mr-5 bg-background/40 flex items-center justify-center text-3xl">🎨</div>
                      )}
                      <div>
                        <div className="text-lg font-semibold">{proj.project_idea}</div>
                        <div className="text-sm text-zinc-400">{proj.project_type} • Minted {proj.minted_at ? new Date(proj.minted_at).toLocaleString() : "—"}</div>
                        <div className="mt-2">
                          Funding: <span className="font-mono">{proj.funding_total?.toLocaleString("en", {minimumFractionDigits:2}) || "0.00"}</span> / <span className="font-mono">{proj.funding_target?.toLocaleString("en", {minimumFractionDigits:2}) || "0.00"}</span> USDC
                        </div>
                        {proj.zora_coin_url && (
                          <a href={proj.zora_coin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent underline">
                            View on Zora
                          </a>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            !isLoading && <div className="text-zinc-400 mt-6 text-center">No Drops yet. <Link to="/" className="text-accent underline">Launch your first Drop.</Link></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
