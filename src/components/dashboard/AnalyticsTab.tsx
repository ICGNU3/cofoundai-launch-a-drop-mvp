
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
      <div className="text-center py-20 font-inter">
        <div className="max-w-md mx-auto">
          <h3 className="text-3xl font-light tracking-tighter text-text mb-4">
            No Projects Yet
          </h3>
          <p className="text-lg text-text/70 font-light tracking-wide mb-8">
            Create your first project to start tracking comprehensive analytics and insights!
          </p>
          <Link
            to="/"
            className="inline-flex px-8 py-3 bg-accent text-black rounded-lg hover:bg-accent/90 transition font-light tracking-wide text-base"
          >
            Launch Your First Drop
          </Link>
        </div>
      </div>
    );
  }

  const projectsWithTokens = projects.filter(project => project.token_address);

  if (projectsWithTokens.length === 0) {
    return (
      <div className="text-center py-20 font-inter">
        <div className="max-w-md mx-auto">
          <h3 className="text-3xl font-light tracking-tighter text-text mb-4">
            No Analytics Available
          </h3>
          <p className="text-lg text-text/70 font-light tracking-wide mb-8">
            Deploy a token to start tracking detailed analytics and performance metrics!
          </p>
          <Link
            to="/"
            className="inline-flex px-8 py-3 bg-accent text-black rounded-lg hover:bg-accent/90 transition font-light tracking-wide text-base"
          >
            Launch Your First Drop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 font-inter">
      {/* Analytics Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-light tracking-tighter text-text mb-2">
          Creator Analytics
        </h2>
        <p className="text-lg text-text/70 font-light tracking-wide">
          Deep insights into your project performance and token metrics
        </p>
      </div>

      {/* Analytics Dashboard for Each Project */}
      {projectsWithTokens.map((project) => (
        <div key={project.id} className="space-y-6">
          <div className="pb-4 border-b border-border">
            <h3 className="text-2xl font-light tracking-tighter text-text mb-1">
              {project.project_idea}
            </h3>
            <p className="text-text/70 font-light tracking-wide">
              Token: {project.token_address}
            </p>
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
