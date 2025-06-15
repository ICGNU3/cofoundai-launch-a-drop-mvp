
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import { usePrivy } from "@privy-io/react-auth";
import { Link, useNavigate } from "react-router-dom";

type Project = {
  id: string;
  project_idea: string;
  project_type: string;
  minted_at: string | null;
  funding_total: number | null;
  funding_target: number | null;
  zora_coin_url: string | null;
  cover_art_url: string | null;
  token_address: string | null;
  tx_hash: string | null;
  streams_active: boolean | null;
  escrow_funded_amount: number | null;
};

const Dashboard: React.FC = () => {
  const { user, ready } = usePrivy();
  const navigate = useNavigate();

  const { data: projects, isLoading, refetch } = useQuery({
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

  // Auto-refresh every 30 seconds for live updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Auto-navigate to latest project dashboard if user refreshes after minting
  useEffect(() => {
    if (projects && projects.length > 0 && ready) {
      const latestProject = projects[0];
      const isRecentlyMinted = latestProject.minted_at && 
        new Date(latestProject.minted_at).getTime() > Date.now() - 5 * 60 * 1000; // Last 5 minutes
      
      if (isRecentlyMinted && latestProject.token_address) {
        // Auto-navigate to latest project dashboard if recently minted
        const shouldAutoNavigate = sessionStorage.getItem('autoNavigateToProject');
        if (shouldAutoNavigate === latestProject.id) {
          sessionStorage.removeItem('autoNavigateToProject');
          navigate(`/project/${latestProject.id}/dashboard`);
        }
      }
    }
  }, [projects, ready, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-8 px-4">
      <div className="flex items-center justify-between w-full max-w-3xl mb-4">
        <h1 className="text-3xl font-bold">My Drops Dashboard</h1>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-accent/20 text-accent border border-accent rounded-lg hover:bg-accent/30 transition"
        >
          Refresh
        </button>
      </div>
      
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
                  <div className="rounded-lg border bg-card hover:shadow-lg transition p-6 relative">
                    <div className="flex">
                      {proj.cover_art_url ? (
                        <img src={proj.cover_art_url} className="w-20 h-20 rounded-md mr-5 object-cover" alt="cover" />
                      ) : (
                        <div className="w-20 h-20 rounded-md mr-5 bg-background/40 flex items-center justify-center text-3xl">🎨</div>
                      )}
                      <div className="flex-1">
                        <div className="text-lg font-semibold">{proj.project_idea}</div>
                        <div className="text-sm text-zinc-400 mb-2">{proj.project_type} • Minted {proj.minted_at ? new Date(proj.minted_at).toLocaleString() : "—"}</div>
                        
                        {/* Status indicators */}
                        <div className="flex gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${proj.token_address ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                            <span className="text-xs text-body-text/70">
                              {proj.token_address ? 'Minted' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${proj.streams_active ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            <span className="text-xs text-body-text/70">
                              {proj.streams_active ? 'Streaming' : 'No Streams'}
                            </span>
                          </div>
                          {proj.escrow_funded_amount && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                              <span className="text-xs text-body-text/70">
                                ${proj.escrow_funded_amount.toFixed(2)} Escrowed
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          Funding: <span className="font-mono">{proj.funding_total?.toLocaleString("en", {minimumFractionDigits:2}) || "0.00"}</span> / <span className="font-mono">{proj.funding_target?.toLocaleString("en", {minimumFractionDigits:2}) || "0.00"}</span> USDC
                        </div>
                        
                        <div className="flex gap-2">
                          <Link 
                            to={`/project/${proj.id}`} 
                            className="text-sm text-accent hover:underline"
                          >
                            View Details
                          </Link>
                          {proj.token_address && (
                            <Link 
                              to={`/project/${proj.id}/dashboard`} 
                              className="text-sm text-accent hover:underline font-semibold"
                            >
                              Dashboard
                            </Link>
                          )}
                          {proj.zora_coin_url && (
                            <a href={proj.zora_coin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">
                              View on Zora
                            </a>
                          )}
                          {proj.tx_hash && (
                            <a href={`https://etherscan.io/tx/${proj.tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">
                              View TX
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
