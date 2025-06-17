
import React from 'react';
import { Link } from 'react-router-dom';
import { ProjectPreviewCard } from '@/components/ProjectPreviewCard';
import { StreamlinedWizardButton } from '@/components/StreamlinedWizardButton';
import { usePrivy } from '@privy-io/react-auth';

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
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || null;

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-20 font-inter">
        <div className="max-w-md mx-auto">
          <h3 className="text-3xl font-light tracking-tighter text-text mb-4">
            No projects yet
          </h3>
          <p className="text-lg text-text/70 font-light tracking-wide mb-8">
            Create your first project to get started building your own economy!
          </p>
          <StreamlinedWizardButton 
            walletAddress={walletAddress}
            variant="default"
            size="default"
            className="bg-accent text-black hover:bg-accent/90 font-light tracking-wide px-8 py-3 text-base"
          >
            Launch Your First Drop
          </StreamlinedWizardButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-inter">
      {/* Projects Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-light tracking-tighter text-text mb-2">
            Your Projects
          </h2>
          <p className="text-lg text-text/70 font-light tracking-wide">
            Manage and track all your launched projects
          </p>
        </div>
        <StreamlinedWizardButton 
          walletAddress={walletAddress}
          variant="outline"
          size="default"
          className="border-accent text-accent hover:bg-accent hover:text-black font-light tracking-wide px-6 py-3"
        >
          Create New Project
        </StreamlinedWizardButton>
      </div>
      
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectPreviewCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
