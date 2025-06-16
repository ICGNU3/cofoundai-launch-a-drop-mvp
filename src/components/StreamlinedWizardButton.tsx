
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StreamlinedWizardModal } from "./wizard/StreamlinedWizardModal";
import { Zap } from "lucide-react";

interface StreamlinedWizardButtonProps {
  walletAddress: string | null;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
  children?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const StreamlinedWizardButton: React.FC<StreamlinedWizardButtonProps> = ({
  walletAddress,
  variant = "default",
  size = "default",
  className = "",
  children,
  isOpen: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const isModalOpen = isControlled ? controlledOpen : internalOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (isControlled) {
      onOpenChange?.(open);
    } else {
      setInternalOpen(open);
    }
  };

  return (
    <>
      <Button
        onClick={() => handleOpenChange(true)}
        variant={variant}
        size={size}
        className={`gap-2 ${className}`}
      >
        <Zap className="w-4 h-4" />
        {children || "Launch Your Drop"}
      </Button>
      
      <StreamlinedWizardModal
        isOpen={isModalOpen}
        onClose={() => handleOpenChange(false)}
        walletAddress={walletAddress}
      />
    </>
  );
};
