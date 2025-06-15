
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import { ProjectLaunchHub } from "@/components/ProjectLaunchHub";

const ProjectLaunchHubRoute: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const { data: roles } = useQuery({
    queryKey: ["roles", projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from("project_roles").select("*").eq("project_id", projectId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });

  if (loadingProject) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (!project) return <div className="flex min-h-screen items-center justify-center">Project not found.</div>;

  return (
    <div className="min-h-screen py-10 px-2 flex justify-center items-center bg-background/80">
      <ProjectLaunchHub project={project} roles={roles || []} />
    </div>
  );
};

export { ProjectLaunchHubRoute };
