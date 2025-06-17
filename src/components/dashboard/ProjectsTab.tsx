
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
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-headline mb-4">No projects yet</h3>
        <p className="text-body-text mb-6">Create your first project to get started!</p>
        <StreamlinedWizardButton 
          walletAddress={walletAddress}
          variant="default"
          size="default"
          className="bg-accent text-black hover:bg-accent/90"
        >
          Launch Your First Drop
        </StreamlinedWizardButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-headline">Your Projects</h2>
        <StreamlinedWizardButton 
          walletAddress={walletAddress}
          variant="outline"
          size="sm"
          className="border-accent text-accent hover:bg-accent hover:text-black"
        >
          Create New Project
        </StreamlinedWizardButton>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectPreviewCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
