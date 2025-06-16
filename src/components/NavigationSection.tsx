
import React from "react";
import { Link } from "react-router-dom";
import { StreamlinedWizardButton } from "@/components/StreamlinedWizardButton";
import { usePrivy } from "@privy-io/react-auth";

export const NavigationSection = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || null;

  return (
    <div className="flex gap-4">
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-accent/20 text-accent border border-accent rounded-lg hover:bg-accent/30 transition"
      >
        ← Back to Dashboard
      </Link>
      
      <StreamlinedWizardButton 
        walletAddress={walletAddress}
        variant="default"
        size="default"
        className="bg-accent text-black hover:bg-accent/90"
      >
        Launch New Drop
      </StreamlinedWizardButton>
      
      <Link
        to="/workspace/demo-project-id"
        className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-700 transition"
      >
        Try Collaborative Workspace
      </Link>
    </div>
  );
};
