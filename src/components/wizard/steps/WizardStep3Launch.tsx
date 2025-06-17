
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Zap, CheckCircle, Loader2, AlertCircle, XCircle } from "lucide-react";
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
  const [launchError, setLaunchError] = useState<string | null>(null);

  // Calculate values for minting
  const expenseSum = state.expenses.reduce((sum, exp) => sum + exp.amountUSDC, 0);
  const pledgeNum = Number(state.pledgeUSDC) || 0;
  const fundingTarget = expenseSum + pledgeNum;

  // Validation checks
  const validationChecks = [
    {
      id: 'wallet',
      label: 'Wallet Connected',
      isValid: !!walletAddress,
      detail: walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'No wallet connected'
    },
    {
      id: 'project',
      label: 'Project Configuration Complete',
      isValid: state.projectIdea.trim().length >= 10 && !!state.projectType,
      detail: state.projectIdea.trim().length >= 10 ? 'Project details validated' : 'Project details incomplete'
    },
    {
      id: 'team',
      label: 'Team Setup Valid',
      isValid: state.roles.length > 0 && state.roles.reduce((sum, role) => sum + role.percent, 0) === 100,
      detail: `${state.roles.length} member(s), ${state.roles.reduce((sum, role) => sum + role.percent, 0)}% allocated`
    },
    {
      id: 'budget',
      label: 'Budget Configuration',
      isValid: state.expenses.length > 0 && expenseSum > 0,
      detail: `${state.expenses.length} item(s), $${expenseSum.toLocaleString()} total`
    }
  ];

  const allValidationsPassed = validationChecks.every(check => check.isValid);

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

  const getValidationIcon = (isValid: boolean, isLoading: boolean = false) => {
    if (isLoading) return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    if (isValid) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Launch Error Display */}
      {launchError && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">Launch Failed</p>
                <p className="text-xs text-red-600 mt-1">{launchError}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLaunchError(null)}
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Launch Readiness Validation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Launch Readiness
            {allValidationsPassed ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {validationChecks.map((check) => (
              <div key={check.id} className="flex items-center gap-3">
                {getValidationIcon(check.isValid, isLaunching && check.id === 'wallet')}
                <div className="flex-1">
                  <span className={`text-sm ${check.isValid ? 'text-text' : 'text-red-600'}`}>
                    {check.label}
                  </span>
                  <span className={`text-xs ml-2 ${check.isValid ? 'text-text/60' : 'text-red-500'}`}>
                    {check.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {!allValidationsPassed && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                Please resolve the validation issues above before launching your project.
              </p>
            </div>
          )}
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
              disabled={isLaunching || mintingWorkflow.isMinting}
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
          disabled={!allValidationsPassed || isLaunching || mintingWorkflow.isMinting}
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
            : allValidationsPassed 
            ? "Your project will be deployed to the blockchain and made available for supporters"
            : "Complete all validation requirements above to proceed with launch"
          }
        </p>
      </div>
    </div>
  );
};
