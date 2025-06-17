
import React from 'react';
import { Link } from 'react-router-dom';
import { CreatorAnalyticsDashboard } from '@/components/CreatorAnalyticsDashboard';
import { usePrivy } from '@privy-io/react-auth';

interface Project {
  id: string;
  project_idea: string;
  project_type: string | null;
  token_address: string | null;
  wallet_address: string | null;
}

interface AnalyticsTabProps {
  projects: Project[] | undefined;
}

export function AnalyticsTab({ projects }: AnalyticsTabProps) {
  const { user } = usePrivy();

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-headline mb-4">No Projects Yet</h3>
        <p className="text-body-text mb-6">Create your first project to start tracking analytics!</p>
        <Link
          to="/"
          className="inline-flex px-6 py-3 bg-accent text-black rounded-lg hover:bg-accent/90 transition"
        >
          Launch Your First Drop
        </Link>
      </div>
    );
  }

  const projectsWithTokens = projects.filter(project => project.token_address);

  if (projectsWithTokens.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-headline mb-4">No Analytics Available</h3>
        <p className="text-body-text mb-6">Deploy a token to start tracking analytics!</p>
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
    <div className="space-y-8">
      {projectsWithTokens.map((project) => (
        <div key={project.id}>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{project.project_idea}</h3>
            <p className="text-text/70 text-sm">Token: {project.token_address}</p>
          </div>
          <CreatorAnalyticsDashboard
            tokenAddress={project.token_address!}
            tokenSymbol={project.project_type || 'TOKEN'}
            creatorAddress={project.wallet_address || user?.wallet?.address || ''}
          />
        </div>
      ))}
    </div>
  );
}
