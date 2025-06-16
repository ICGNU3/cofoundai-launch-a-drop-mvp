
import React from "react";
import { Link } from "react-router-dom";

interface ProjectNextStepsProps {
  projectId: string;
}

export const ProjectNextSteps: React.FC<ProjectNextStepsProps> = ({
  projectId,
}) => {
  return (
    <div className="space-y-3">
      <h4 className="font-bold text-lg">Next Steps</h4>
      <ul className="list-disc pl-6 text-body-text/90 space-y-1">
        <li>
          <span className="font-semibold text-accent">Share your Drop</span> on social media or with your team for more visibility.
        </li>
        <li>
          <Link to={`/project/${projectId}/dashboard`} className="text-accent underline hover:text-accent/80">
            View Drop Dashboard
          </Link>
          {" "} to monitor, manage, and update your Drop.
        </li>
        <li>
          <Link to="/dashboard" className="text-accent underline hover:text-accent/80">
            Go to My Projects
          </Link>
          {" "} to launch or review more Drops.
        </li>
        <li>
          <a href="https://docs.lovable.dev/faq" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80">
            Explore the community FAQ / Get support
          </a>
        </li>
      </ul>
    </div>
  );
};
