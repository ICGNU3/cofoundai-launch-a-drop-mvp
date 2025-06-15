
import React, { useState } from "react";
import { Share2, Download, Copy, ExternalLink, BarChart3, Users, DollarSign, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AccentButton } from "./ui/AccentButton";

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

  const shareableText = `🚀 Just launched my new ${project.project_type.toLowerCase()} drop: "${project.project_idea}"!\n\nCheck it out: ${window.location.origin}/project/${project.id}${project.zora_coin_url ? `\n\n🎨 Mint on Zora: ${project.zora_coin_url}` : ""}`;

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
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="text-2xl font-bold text-headline">🎉 Drop Launched Successfully!</div>
        <div className="text-body-text/70">Your project is now live and ready to share with the world</div>
      </div>

      {/* Cover Art & Basic Info */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {project.cover_art_url && (
          <div className="relative">
            <img 
              src={project.cover_art_url} 
              alt="Cover Art" 
              className="w-32 h-32 rounded-lg object-cover border border-border"
            />
            <button
              onClick={handleDownloadCoverArt}
              className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:bg-accent/80 transition"
            >
              <Download size={14} className="text-white" />
            </button>
          </div>
        )}
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-semibold text-body-text mb-2">{project.project_idea}</h3>
          <p className="text-body-text/70 mb-3">{project.project_type} Drop</p>
          
          {project.zora_coin_url && (
            <a 
              href={project.zora_coin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 text-sm"
            >
              <ExternalLink size={14} />
              View on Zora
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          {[
            { key: "overview", label: "Overview", icon: BarChart3 },
            { key: "analytics", label: "Analytics", icon: TrendingUp },
            { key: "share", label: "Share", icon: Share2 }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition ${
                activeTab === tab.key
                  ? "border-accent text-accent"
                  : "border-transparent text-body-text/70 hover:text-body-text"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{analytics.views}</div>
            <div className="text-sm text-body-text/70">Views</div>
          </div>
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{analytics.shares}</div>
            <div className="text-sm text-body-text/70">Shares</div>
          </div>
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{analytics.collaborators}</div>
            <div className="text-sm text-body-text/70">Collaborators</div>
          </div>
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent">{analytics.fundingProgress.toFixed(0)}%</div>
            <div className="text-sm text-body-text/70">Funded</div>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-4">
          <div className="bg-background/50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Funding Progress</h4>
            <div className="w-full bg-border rounded-full h-3">
              <div 
                className="bg-accent h-3 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(analytics.fundingProgress, 100)}%` }}
              />
            </div>
            <div className="text-sm text-body-text/70 mt-2">
              ${project.funding_total || 0} / ${project.funding_target} USDC
            </div>
          </div>
          
          <div className="bg-background/50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Recent Activity</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-body-text/70">Project launched</span>
                <span className="text-green-400">Just now</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-text/70">Cover art generated</span>
                <span className="text-blue-400">2 min ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-text/70">Token minted</span>
                <span className="text-purple-400">3 min ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "share" && (
        <div className="space-y-6">
          {/* Shareable Text */}
          <div className="space-y-3">
            <h4 className="font-semibold">Shareable Copy</h4>
            <div className="bg-background/50 border border-border rounded-lg p-4">
              <pre className="text-sm text-body-text whitespace-pre-wrap font-sans">
                {shareableText}
              </pre>
            </div>
            <AccentButton onClick={handleCopyShareableText} className="w-full">
              <Copy size={16} />
              Copy Shareable Text
            </AccentButton>
          </div>

          {/* Platform Sharing */}
          <div className="space-y-3">
            <h4 className="font-semibold">Share on Platforms</h4>
            <div className="grid gap-3">
              {platformShares.map(platform => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${platform.color} text-white px-4 py-3 rounded-lg hover:opacity-80 transition flex items-center justify-center gap-2`}
                >
                  <Share2 size={16} />
                  Share on {platform.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
