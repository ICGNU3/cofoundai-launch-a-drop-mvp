
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Zap, CheckCircle, Loader2 } from "lucide-react";
import { useMintingWorkflow } from "@/hooks/useMintingWorkflow";
import { useToast } from "@/hooks/use-toast";
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";

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

  // Calculate values for minting
  const expenseSum = state.expenses.reduce((sum, exp) => sum + exp.amountUSDC, 0);
  const pledgeNum = Number(state.pledgeUSDC) || 0;
  const fundingTarget = expenseSum + pledgeNum;

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
      toast({
        title: "Project Launched! 🚀",
        description: "Your project has been successfully created and is ready for supporters.",
      });
      onComplete();
    },
  });

  const handleLaunch = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet before launching.",
        variant: "destructive",
      });
      return;
    }

    setIsLaunching(true);
    
    try {
      console.log("Starting project launch with state:", state);
      
      // Start the minting flow with standard gas speed
      const result = await mintingWorkflow.handleMintFlow({ gasSpeed: "standard" });
      
      if (result.step === "complete") {
        console.log("Launch completed successfully");
        // The onSaveComplete callback will handle the success flow
      } else if (result.error) {
        console.error("Launch failed:", result.error);
        toast({
          title: "Launch Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Launch error:", error);
      toast({
        title: "Launch Error",
        description: error?.message || "An unexpected error occurred during launch.",
        variant: "destructive",
      });
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-text/70">Project Type:</span>
            <span className="text-sm font-medium">{state.projectType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text/70">Mode:</span>
            <span className="text-sm font-medium">{state.mode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text/70">Team Members:</span>
            <span className="text-sm font-medium">{state.roles.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text/70">Budget Items:</span>
            <span className="text-sm font-medium">{state.expenses.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text/70">Initial Pledge:</span>
            <span className="text-sm font-medium">${state.pledgeUSDC || "0"} USDC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text/70">Funding Target:</span>
            <span className="text-sm font-medium">${fundingTarget.toLocaleString()} USDC</span>
          </div>
        </CardContent>
      </Card>

      {/* Token Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Token Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Advanced Token Settings</h4>
              <p className="text-xs text-text/60">
                Customize vesting, utility, and distribution
              </p>
            </div>
            <Switch
              checked={state.doAdvancedToken}
              onCheckedChange={(checked) => updateField("doAdvancedToken", checked)}
              disabled={isLaunching}
            />
          </div>
          
          {!state.doAdvancedToken && (
            <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Default NEPLUS Coin Settings</span>
              </div>
              <ul className="text-xs text-text/60 space-y-1">
                <li>• Standard ERC-20 token (NPLUS)</li>
                <li>• Revenue sharing based on team splits</li>
                <li>• Immediate distribution</li>
                <li>• 5% creator royalties on trading</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Launch Readiness */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Launch Readiness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-sm">Wallet Connected</span>
              <span className="text-xs text-text/60 font-mono">
                {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "No wallet"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-sm">Project Configuration Complete</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-sm">Ready to Deploy</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Minting Progress */}
      {mintingWorkflow.isMinting && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Launching Project...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-text/70">{mintingWorkflow.mintingStatus}</div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${mintingWorkflow.progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          className="gap-2"
          disabled={isLaunching || mintingWorkflow.isMinting}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleLaunch}
          className="bg-accent text-black hover:bg-accent/90 gap-2"
          disabled={!walletAddress || isLaunching || mintingWorkflow.isMinting}
        >
          {isLaunching || mintingWorkflow.isMinting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {isLaunching || mintingWorkflow.isMinting ? "Launching..." : "Launch Project"}
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center text-xs text-text/50 border-t border-border pt-4">
        <p>
          {isLaunching || mintingWorkflow.isMinting 
            ? "Please wait while we deploy your project to the blockchain..."
            : "Your project will be deployed to the blockchain and made available for supporters"
          }
        </p>
      </div>
    </div>
  );
};
