
import React from "react";
import { Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectCoverArtDisplayProps {
  coverArtUrl: string | null;
  projectIdea: string;
  zoraCoinUrl?: string;
  fundingTotal?: number;
  fundingTarget: number;
}

export const ProjectCoverArtDisplay: React.FC<ProjectCoverArtDisplayProps> = ({
  coverArtUrl,
  projectIdea,
  zoraCoinUrl,
  fundingTotal,
  fundingTarget,
}) => {
  const { toast } = useToast();

  const handleDownloadCoverArt = () => {
    if (coverArtUrl) {
      const link = document.createElement('a');
      link.href = coverArtUrl;
      link.download = `${projectIdea}-cover-art.png`;
      link.click();
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {coverArtUrl && (
        <div className="relative">
          <img
            src={coverArtUrl}
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
        {zoraCoinUrl && (
          <a
            href={zoraCoinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-lg text-accent hover:text-accent/80 font-semibold underline mb-2"
          >
            <ExternalLink size={20} />
            View Your Coin on Zora
          </a>
        )}
        <div className="mt-4 mb-2">
          <span className="font-bold text-xl">{projectIdea}</span>
        </div>
        <div className="mb-3">
          {fundingTotal ? (
            <span className="font-mono text-accent text-lg">${Number(fundingTotal).toLocaleString()}</span>
          ) : (
            <span className="font-mono text-accent text-lg">$0</span>
          )}
          <span className="ml-2 text-sm text-body-text/70">funded of</span>
          <span className="ml-2 font-mono">${Number(fundingTarget).toLocaleString()} USDC</span>
        </div>
      </div>
    </div>
  );
};
