
import React from 'react';
import { Link } from 'react-router-dom';
import { ProjectPreviewCard } from '@/components/ProjectPreviewCard';

interface Project {
  id: string;
  project_idea: string;
  project_type: string | null;
  token_address: string | null;
  wallet_address: string | null;
  created_at: string;
  owner_id: string;
  cover_art_url?: string;
  funding_target: number;
  funding_total?: number;
}

interface ProjectsTabProps {
  projects: Project[] | undefined;
}

export function ProjectsTab({ projects }: ProjectsTabProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-headline mb-4">No projects yet</h3>
        <p className="text-body-text mb-6">Create your first project to get started!</p>
        <Link
          to="/"
          className="inline-flex px-6 py-3 bg-accent text-black rounded-lg hover:bg-accent/90 transition"
        >
          Launch Your First Drop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectPreviewCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
