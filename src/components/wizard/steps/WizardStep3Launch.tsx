
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Zap, CheckCircle } from "lucide-react";
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
  const handleLaunch = () => {
    // Here we would trigger the actual minting/launch process
    console.log("Launching project with state:", state);
    onComplete();
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
            />
          </div>
          
          {!state.doAdvancedToken && (
            <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Default Token Settings</span>
              </div>
              <ul className="text-xs text-text/60 space-y-1">
                <li>• Standard ERC-20 token</li>
                <li>• Revenue sharing based on team splits</li>
                <li>• Immediate distribution</li>
                <li>• Basic utility features</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallet Status */}
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

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleLaunch}
          className="bg-accent text-black hover:bg-accent/90 gap-2"
          disabled={!walletAddress}
        >
          <Zap className="w-4 h-4" />
          Launch Project
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center text-xs text-text/50 border-t border-border pt-4">
        <p>Your project will be deployed to the blockchain and made available for supporters</p>
      </div>
    </div>
  );
};
