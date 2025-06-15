import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
// Minimal UI components:
import { ProjectFundingProgress, ProjectAnalytics, ProjectShares } from "@/components/ProjectOverviewParts";

const ProjectOverview: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch project, roles, expenses, analytics, latest funding
  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: roles } = useQuery({
    queryKey: ["roles", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("project_roles").select("*").eq("project_id", id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  const { data: expenses } = useQuery({
    queryKey: ["expenses", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("project_expenses").select("*").eq("project_id", id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  const { data: analytics } = useQuery({
    queryKey: ["analytics", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("project_analytics").select("*").eq("project_id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (loadingProject) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center">Project not found.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 px-2">
      <div className="max-w-2xl w-full border rounded-lg bg-card shadow-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          {project.cover_art_url ? (
            <img src={project.cover_art_url} alt="Cover art" className="w-24 h-24 rounded-lg object-cover" />
          ) : (
            <div className="w-24 h-24 bg-zinc-900 rounded-lg flex items-center justify-center text-5xl">🎨</div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{project.project_idea}</h2>
            <div className="text-zinc-400 capitalize">{project.project_type}</div>
            <div className="text-sm text-green-400 mt-2 font-mono">{project.minted_at ? `Minted!` : `Draft`}</div>
            {project.zora_coin_url && (
              <a href={project.zora_coin_url} target="_blank" rel="noopener noreferrer" className="inline-block bg-accent mt-2 px-3 py-1 rounded-full text-sm text-white">View on Zora</a>
            )}
          </div>
        </div>
        <hr className="my-4" />
        <div>
          <h3 className="font-semibold mb-2">Collaborators & Roles</h3>
          <ul className="flex flex-wrap gap-2 mb-3">
            {roles && roles.length > 0 ? (
              roles.map((role) => (
                <li key={role.id} className="role-pill">{role.name} <span className="ml-2 font-mono">{role.percent}%</span></li>
              ))
            ) : (
              <li className="text-zinc-400">No roles defined.</li>
            )}
          </ul>
          <div>
            <h3 className="font-semibold mb-2">Expenses</h3>
            <ul className="flex flex-col gap-1 mb-3">
              {expenses && expenses.length > 0 ? (
                expenses.map((exp) => (
                  <li key={exp.id} className="expense-pill flex items-center">
                    <span>{exp.name}</span>
                    <span className="ml-2 font-mono">${exp.amount_usdc}</span>
                    <span className="ml-2 text-xs text-zinc-400">{exp.payout_type || '—'}</span>
                  </li>
                ))
              ) : (
                <li className="text-zinc-400">No expenses yet.</li>
              )}
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <ProjectFundingProgress project={project} />
        <hr className="my-4" />
        <ProjectAnalytics analytics={analytics} />
        <ProjectShares project={project} />
        <div className="mt-4 flex gap-3">
          <a
            href={project.cover_art_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-800 px-4 py-2 rounded text-white hover:bg-zinc-700 text-sm"
          >Download Cover Art</a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${project.project_idea}\nCheck out our Drop: ${window.location.origin}/project/${project.id}${project.zora_coin_url ? `\nZora: ${project.zora_coin_url}` : ""}`);
              alert("Project shareable copy copied!");
            }}
            className="bg-accent px-4 py-2 rounded text-white text-sm"
          >Copy Shareable Copy</button>
          <Link to="/dashboard" className="bg-zinc-700 px-4 py-2 rounded text-white text-sm">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
