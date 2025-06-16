
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { StreamlinedWizardModal } from "./wizard/StreamlinedWizardModal";
import { Zap } from "lucide-react";

interface StreamlinedWizardButtonProps {
  walletAddress: string | null;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export const StreamlinedWizardButton: React.FC<StreamlinedWizardButtonProps> = ({
  walletAddress,
  variant = "default",
  size = "default",
  className = "",
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant={variant}
        size={size}
        className={`gap-2 ${className}`}
      >
        <Zap className="w-4 h-4" />
        {children || "Launch Your Drop"}
      </Button>
      
      <StreamlinedWizardModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        walletAddress={walletAddress}
      />
    </>
  );
};
