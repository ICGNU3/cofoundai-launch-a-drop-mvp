import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { usePrivy } from "@privy-io/react-auth";
import { ProjectFundingProgress } from "@/components/ProjectOverviewParts";
import { ProjectLaunchHub } from "@/components/ProjectLaunchHub";

type ProjectWithDetails = {
  id: string;
  project_idea: string;
  project_type: string;
  token_address: string | null;
  tx_hash: string | null;
  expense_sum: number | null;
  escrow_funded_amount: number | null;
  streams_active: boolean | null;
  funding_total: number | null;
  funding_target: number | null;
  minted_at: string | null;
  cover_art_url: string | null;
  roles: Array<{
    id: string;
    name: string;
    percent: number;
    stream_flow_rate: number | null;
    stream_active: boolean | null;
    wallet_address: string | null;
  }>;
};

const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = usePrivy();

  const { data: project, isLoading, refetch } = useQuery({
    queryKey: ["project-dashboard", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID required");
      
      // Get project details
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectError) throw projectError;

      // Get project roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("project_roles")
        .select("*")
        .eq("project_id", projectId);

      if (rolesError) throw rolesError;

      return {
        ...projectData,
        roles: rolesData || []
      } as ProjectWithDetails;
    },
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-body-text">Loading project dashboard...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-body-text">Project not found</div>
      </div>
    );
  }

  const activeStreams = project.roles.filter(role => role.stream_active);
  const totalFlowRate = activeStreams.reduce((sum, role) => sum + (role.stream_flow_rate || 0), 0);

  // Check if this is a newly launched project (minted in last 10 minutes)
  const isNewlyLaunched = project.minted_at && 
    Date.now() - new Date(project.minted_at).getTime() < 10 * 60 * 1000;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Show Launch Hub for newly launched projects */}
        {isNewlyLaunched && (
          <div className="mb-8">
            <ProjectLaunchHub 
              project={project} 
              roles={project.roles}
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-headline">
              {isNewlyLaunched ? "Project Launch Hub" : "Project Dashboard"}
            </h1>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition"
            >
              Refresh
            </button>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-body-text mb-2">{project.project_idea}</h2>
            <span className="text-sm text-body-text/70">{project.project_type}</span>
          </div>
        </div>

        {/* Rest of the existing dashboard content */}
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Token Minted Status */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-body-text mb-3">Token Status</h3>
            {project.token_address ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-medium">Minted</span>
                </div>
                <div className="text-sm text-body-text/70 break-all">
                  Token: {project.token_address}
                </div>
                {project.tx_hash && (
                  <a
                    href={`https://etherscan.io/tx/${project.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent text-sm hover:underline block"
                  >
                    View Transaction
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-yellow-400 font-medium">Pending</span>
              </div>
            )}
          </div>

          {/* Escrow Status */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-body-text mb-3">Escrow Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  (project.escrow_funded_amount || 0) >= (project.expense_sum || 0)
                    ? 'bg-green-400' 
                    : 'bg-yellow-400'
                }`}></div>
                <span className={`font-medium ${
                  (project.escrow_funded_amount || 0) >= (project.expense_sum || 0)
                    ? 'text-green-400' 
                    : 'text-yellow-400'
                }`}>
                  {(project.escrow_funded_amount || 0) >= (project.expense_sum || 0) ? 'Funded' : 'Partial'}
                </span>
              </div>
              <div className="text-sm text-body-text/70">
                ${(project.escrow_funded_amount || 0).toFixed(2)} / ${(project.expense_sum || 0).toFixed(2)} USDC
              </div>
            </div>
          </div>

          {/* Streams Status */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-body-text mb-3">Streams Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  project.streams_active ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <span className={`font-medium ${
                  project.streams_active ? 'text-green-400' : 'text-red-400'
                }`}>
                  {project.streams_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-sm text-body-text/70">
                {activeStreams.length} of {project.roles.length} streams running
              </div>
              {totalFlowRate > 0 && (
                <div className="text-sm text-body-text/70">
                  Flow rate: {totalFlowRate.toFixed(6)} USDC/sec
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Funding Progress */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <ProjectFundingProgress project={project} />
        </div>

        {/* Active Streams Detail */}
        {activeStreams.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-body-text mb-4">Active Payment Streams</h3>
            <div className="space-y-3">
              {activeStreams.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 bg-background/50 rounded">
                  <div>
                    <div className="font-medium text-body-text">{role.name}</div>
                    <div className="text-sm text-body-text/70">{role.percent}% share</div>
                    {role.wallet_address && (
                      <div className="text-xs text-body-text/50 break-all">{role.wallet_address}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-mono text-sm">
                      {(role.stream_flow_rate || 0).toFixed(6)} USDC/sec
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Roles */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-body-text mb-4">All Roles</h3>
          <div className="space-y-2">
            {project.roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-2 border-b border-border last:border-b-0">
                <div>
                  <span className="font-medium text-body-text">{role.name}</span>
                  <span className="ml-2 text-sm text-body-text/70">{role.percent}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    role.stream_active ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs text-body-text/70">
                    {role.stream_active ? 'Streaming' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-accent/20 text-accent border border-accent rounded-lg hover:bg-accent/30 transition"
          >
            ← Back to Dashboard
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/80 transition"
          >
            Launch New Drop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
