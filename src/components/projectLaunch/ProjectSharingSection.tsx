
import React from "react";
import { Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectSharingSectionProps {
  project: {
    id: string;
    project_idea: string;
    project_type: string;
    zora_coin_url?: string;
  };
}

export const ProjectSharingSection: React.FC<ProjectSharingSectionProps> = ({
  project,
}) => {
  const { toast } = useToast();

  const shareableText =
    `🚀 Just launched my new ${project.project_type.toLowerCase()} drop: "${project.project_idea}"!\n\nCheck it out: ${window.location.origin}/project/${project.id}${project.zora_coin_url ? `\n\n🎨 Mint on Zora: ${project.zora_coin_url}` : ""}`;

  const handleCopyShareableText = () => {
    navigator.clipboard.writeText(shareableText);
    toast({
      title: "Copied!",
      description: "Shareable text copied to clipboard",
    });
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

  return (
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
  );
};
