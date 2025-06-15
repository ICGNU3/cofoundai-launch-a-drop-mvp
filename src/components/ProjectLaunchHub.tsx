import React, { useState } from "react";
import { Share2, Download, Copy, ExternalLink, BarChart3, Users, DollarSign, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AccentButton } from "./ui/AccentButton";
import { Link } from "react-router-dom";

interface ProjectLaunchHubProps {
  project: {
    id: string;
    project_idea: string;
    project_type: string;
    token_address: string | null;
    tx_hash: string | null;
    cover_art_url: string | null;
    zora_coin_url?: string;
    funding_target: number;
    funding_total?: number;
  };
  roles: Array<{
    id: string;
    name: string;
    percent: number;
  }>;
}

export const ProjectLaunchHub: React.FC<ProjectLaunchHubProps> = ({
  project,
  roles,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "share">("overview");

  // Celebration logic
  // Add simple animation/confetti
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shareableText =
    `🚀 Just launched my new ${project.project_type.toLowerCase()} drop: "${project.project_idea}"!\n\nCheck it out: ${window.location.origin}/project/${project.id}${project.zora_coin_url ? `\n\n🎨 Mint on Zora: ${project.zora_coin_url}` : ""}`;

  const handleCopyShareableText = () => {
    navigator.clipboard.writeText(shareableText);
    toast({
      title: "Copied!",
      description: "Shareable text copied to clipboard",
    });
  };

  const handleDownloadCoverArt = () => {
    if (project.cover_art_url) {
      const link = document.createElement('a');
      link.href = project.cover_art_url;
      link.download = `${project.project_idea}-cover-art.png`;
      link.click();
    }
  };

  const platformShares = [
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareableText)}`,
      color: "bg-blue-500"
    },
    {
      name: "LinkedIn",
      url: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/project/' + project.id)}`,
      color: "bg-blue-700"
    },
    {
      name: "Facebook",
      url: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/project/' + project.id)}`,
      color: "bg-blue-600"
    }
  ];

  // Mock analytics data
  const analytics = {
    views: Math.floor(Math.random() * 1000) + 100,
    shares: Math.floor(Math.random() * 50) + 10,
    fundingProgress: ((project.funding_total || 0) / project.funding_target) * 100,
    collaborators: roles.length
  };

  return (
    <div className="bg-card border border-border rounded-lg p-0 shadow-xl max-w-3xl w-full overflow-hidden">
      {/* Celebratory Header */}
      <div className="bg-gradient-to-r from-purple-500 via-accent to-primary text-white py-8 px-4 text-center relative">
        <div className="absolute left-0 right-0 flex justify-center -top-8">
          <span className="text-7xl">🎉</span>
        </div>
        <h2 className="text-3xl font-headline font-bold mb-2 mt-6">All Systems Go!</h2>
        <div className="text-lg font-medium">Your Drop Has Been Successfully Launched!</div>
      </div>

      <div className="p-8 flex flex-col gap-8">
        {/* Cover Art Display */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          {project.cover_art_url && (
            <div className="relative">
              <img
                src={project.cover_art_url}
                alt="Drop Cover Art"
                className="w-40 h-40 md:w-52 md:h-52 rounded-lg object-cover border-4 border-accent shadow-lg bg-white"
              />
              <button
                onClick={handleDownloadCoverArt}
                className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:bg-accent/80 transition"
                aria-label="Download Cover Art"
              >
                <Download size={14} className="text-white" />
              </button>
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            {project.zora_coin_url && (
              <a
                href={project.zora_coin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-lg text-accent hover:text-accent/80 font-semibold underline mb-2"
              >
                <ExternalLink size={20} />
                View Your Coin on Zora
              </a>
            )}
            <div className="mt-4 mb-2">
              <span className="font-bold text-xl">{project.project_idea}</span>
              <div className="text-sm text-body-text/70 mb-1">{project.project_type} Drop</div>
            </div>
            <div className="mb-3">
              {project.funding_total ? (
                <span className="font-mono text-accent text-lg">${Number(project.funding_total).toLocaleString()}</span>
              ) : (
                <span className="font-mono text-accent text-lg">$0</span>
              )}
              <span className="ml-2 text-sm text-body-text/70">funded of</span>
              <span className="ml-2 font-mono">${Number(project.funding_target).toLocaleString()} USDC</span>
            </div>
          </div>
        </div>

        {/* Shareable Copy & Social */}
        <div className="space-y-5">
          <h4 className="font-semibold text-lg">Share Your Drop</h4>
          <div className="bg-background/80 border border-border rounded-lg p-4 shadow-sm space-y-3">
            <pre className="text-sm text-body-text whitespace-pre-wrap font-sans mb-3">{shareableText}</pre>
            <div className="flex flex-col gap-2 md:flex-row md:gap-3">
              <button
                onClick={handleCopyShareableText}
                className="flex items-center justify-center bg-accent text-white px-4 py-2 rounded-md font-medium gap-2 hover:bg-accent/80 transition"
              >
                <Copy size={16} />
                Copy Shareable Text
              </button>
              {platformShares.map(platform => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${platform.color} text-white px-4 py-2 rounded-md hover:opacity-80 transition flex items-center justify-center gap-2 font-medium`}
                >
                  <Share2 size={16} />
                  {platform.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Project Details Summary */}
        <div>
          <h4 className="font-semibold text-lg mb-2">Project Overview</h4>
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <div className="font-medium">Idea</div>
              <div className="text-body-text/90 mb-2">{project.project_idea}</div>
              <div className="font-medium">Type</div>
              <div className="text-body-text/70 mb-2">{project.project_type}</div>
            </div>
            <div>
              <div className="font-medium mb-1">Team Roles</div>
              <ul className="flex flex-wrap gap-2">
                {roles && roles.length > 0 ? (
                  roles.map((role) => (
                    <li
                      key={role.id}
                      className="bg-accent/10 rounded px-2 py-1 text-sm text-accent font-mono font-semibold"
                    >
                      {role.name}
                    </li>
                  ))
                ) : (
                  <li className="text-body-text/50">No roles defined.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps/CTA */}
        <div className="space-y-3">
          <h4 className="font-bold text-lg">Next Steps</h4>
          <ul className="list-disc pl-6 text-body-text/90 space-y-1">
            <li>
              <span className="font-semibold text-accent">Share your Drop</span> on social media or with your team for more visibility.
            </li>
            <li>
              <Link to={`/project/${project.id}/dashboard`} className="text-accent underline hover:text-accent/80">
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
      </div>
    </div>
  );
};
