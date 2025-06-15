
import React from "react";
import { useNavigate } from "react-router-dom";
import { AccentButton } from "./ui/AccentButton";
import { useToast } from "@/hooks/use-toast";

interface ProjectActionButtonsProps {
  projectId: string | null;
  walletAddress: string | null;
  isMinting: boolean;
  usdcxBalanceConfirmed: boolean;
  onMintAndFund: () => void;
  onRestart: () => void;
}

export const ProjectActionButtons: React.FC<ProjectActionButtonsProps> = ({
  projectId,
  walletAddress,
  isMinting,
  usdcxBalanceConfirmed,
  onMintAndFund,
  onRestart,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMarkComplete = () => {
    toast({
      title: "Project Completed",
      description: "Project marked as complete!",
    });
  };

  return (
    <div className="space-y-3">
      {!projectId && (
        <AccentButton
          className="w-full"
          onClick={onMintAndFund}
          disabled={!walletAddress || isMinting}
        >
          {isMinting ? "Minting..." : "🚀 Mint & Fund Drop"}
        </AccentButton>
      )}
      
      {projectId && (
        <>
          <AccentButton
            className="w-full"
            onClick={() => navigate(`/project/${projectId}/dashboard`)}
          >
            View Project Dashboard
          </AccentButton>
          
          <AccentButton
            className="w-full"
            disabled={!usdcxBalanceConfirmed}
            onClick={handleMarkComplete}
          >
            {usdcxBalanceConfirmed ? "Mark Complete ✓" : "Confirming Balance..."}
          </AccentButton>
          
          {!usdcxBalanceConfirmed && (
            <div className="text-xs text-yellow-500 text-center">
              Waiting for USDCx balance confirmation
            </div>
          )}
        </>
      )}

      <AccentButton
        secondary
        className="w-full"
        onClick={onRestart}
        disabled={isMinting}
      >
        Launch Another Drop
      </AccentButton>
    </div>
  );
};
