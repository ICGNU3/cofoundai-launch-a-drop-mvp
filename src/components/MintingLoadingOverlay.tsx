
import React from "react";

interface MintingLoadingOverlayProps {
  isVisible: boolean;
  status: string;
}

export const MintingLoadingOverlay: React.FC<MintingLoadingOverlayProps> = ({
  isVisible,
  status,
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
        <div className="text-lg font-semibold text-body-text">Minting...</div>
        <div className="text-sm text-body-text/70 mt-2">{status}</div>
      </div>
    </div>
  );
};
