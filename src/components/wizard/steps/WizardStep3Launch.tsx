
import React, { useState } from "react";
import { useMintingWorkflow } from "@/hooks/useMintingWorkflow";
import { useToast } from "@/hooks/use-toast";
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";
import { LaunchErrorDisplay } from "./launch/LaunchErrorDisplay";
import { ProjectSummaryCard } from "./launch/ProjectSummaryCard";
import { LaunchReadinessCard } from "./launch/LaunchReadinessCard";
import { TokenConfigurationCard } from "./launch/TokenConfigurationCard";
import { MintingProgressCard } from "./launch/MintingProgressCard";
import { LaunchNavigationButtons } from "./launch/LaunchNavigationButtons";
import { LaunchHelpText } from "./launch/LaunchHelpText";

interface WizardStep3LaunchProps {
  state: StreamlinedWizardState;
  updateField: <K extends keyof StreamlinedWizardState>(field: K, value: StreamlinedWizardState[K]) => void;
  prevStep: () => void;
  onComplete: () => void;
  walletAddress: string | null;
}

export const WizardStep3Launch: React.FC<WizardStep3LaunchProps> = ({
  state,
  updateField,
  prevStep,
  onComplete,
  walletAddress,
}) => {
  const { toast } = useToast();
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);

  // Calculate values for minting
  const expenseSum = state.expenses.reduce((sum, exp) => sum + exp.amountUSDC, 0);
  const pledgeNum = Number(state.pledgeUSDC) || 0;
  const fundingTarget = expenseSum + pledgeNum;

  // Validation checks
  const allValidationsPassed = 
    !!walletAddress &&
    state.projectIdea.trim().length >= 10 && 
    !!state.projectType &&
    state.roles.length > 0 && 
    state.roles.reduce((sum, role) => sum + role.percent, 0) === 100 &&
    state.expenses.length > 0 && 
    expenseSum > 0;

  // Use the minting workflow
  const mintingWorkflow = useMintingWorkflow({
    coverBase64: null, // We'll generate cover art later
    projectIdea: state.projectIdea,
    projectType: state.projectType,
    roles: state.roles,
    expenses: state.expenses,
    pledgeUSDC: state.pledgeUSDC,
    walletAddress,
    expenseSum,
    fundingTarget,
    onSaveComplete: (projectRow: any) => {
      console.log('Project created successfully:', projectRow);
      setLaunchError(null);
      toast({
        title: "Project Launched! 🚀",
        description: "Your project has been successfully created and is ready for supporters.",
      });
      onComplete();
    },
  });

  const handleLaunch = async () => {
    if (!walletAddress) {
      setLaunchError("Please connect your wallet before launching.");
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet before launching.",
        variant: "destructive",
      });
      return;
    }

    if (!allValidationsPassed) {
      setLaunchError("Please complete all required fields before launching.");
      toast({
        title: "Validation Failed",
        description: "Please review and complete all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLaunching(true);
    setLaunchError(null);
    
    try {
      console.log("Starting project launch with state:", state);
      
      // Start the minting flow with standard gas speed
      const result = await mintingWorkflow.handleMintFlow({ gasSpeed: "standard" });
      
      if (result.step === "complete") {
        console.log("Launch completed successfully");
        // The onSaveComplete callback will handle the success flow
      } else if (result.error) {
        console.error("Launch failed:", result.error);
        setLaunchError(result.error);
        toast({
          title: "Launch Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Launch error:", error);
      const errorMessage = error?.message || "An unexpected error occurred during launch.";
      setLaunchError(errorMessage);
      toast({
        title: "Launch Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Launch Error Display */}
      {launchError && (
        <LaunchErrorDisplay 
          error={launchError} 
          onDismiss={() => setLaunchError(null)} 
        />
      )}

      {/* Project Summary */}
      <ProjectSummaryCard state={state} />

      {/* Launch Readiness Validation */}
      <LaunchReadinessCard 
        state={state} 
        walletAddress={walletAddress} 
        isLaunching={isLaunching} 
      />

      {/* Token Configuration */}
      <TokenConfigurationCard 
        state={state} 
        updateField={updateField} 
        isLaunching={isLaunching} 
        isMinting={mintingWorkflow.isMinting} 
      />

      {/* Minting Progress */}
      <MintingProgressCard 
        isMinting={mintingWorkflow.isMinting} 
        mintingStatus={mintingWorkflow.mintingStatus} 
        progress={mintingWorkflow.progress} 
      />

      {/* Navigation */}
      <LaunchNavigationButtons 
        onPrevStep={prevStep} 
        onLaunch={handleLaunch} 
        allValidationsPassed={allValidationsPassed} 
        isLaunching={isLaunching} 
        isMinting={mintingWorkflow.isMinting} 
      />

      {/* Help Text */}
      <LaunchHelpText 
        isLaunching={isLaunching} 
        isMinting={mintingWorkflow.isMinting} 
        allValidationsPassed={allValidationsPassed} 
      />
    </div>
  );
};
