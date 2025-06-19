
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccount } from 'wagmi';
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";
import { ProjectPreview } from "./launch/ProjectPreview";
import { ProjectSummary } from "./launch/ProjectSummary";
import { TokenConfiguration } from "./launch/TokenConfiguration";
import { WalletConnectionSection } from "./launch/WalletConnectionSection";
import { ShareableLink } from "./launch/ShareableLink";

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
  const [showPreview, setShowPreview] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  
  const { address } = useAccount();
  const effectiveWalletAddress = address || walletAddress;

  const handleLaunch = async () => {
    console.log('Launch Project button clicked', { walletAddress: effectiveWalletAddress, isLaunching });
    
    if (!effectiveWalletAddress) {
      console.error('No wallet address available');
      return;
    }
    
    setIsLaunching(true);
    try {
      // Simulate launch process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Launch process completed');
      onComplete();
    } catch (error) {
      console.error('Launch failed:', error);
    } finally {
      setIsLaunching(false);
    }
  };

  const canLaunch = !!effectiveWalletAddress && !isLaunching;

  return (
    <div className="p-6 space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-sm text-accent">
        <div className="w-2 h-2 bg-accent rounded-full"></div>
        <span>Step 3 of 3: Launch Configuration</span>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary">Review & Launch</TabsTrigger>
          <TabsTrigger value="preview" onClick={() => setShowPreview(true)}>
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <ProjectSummary state={state} />
          <TokenConfiguration state={state} updateField={updateField} />
          <WalletConnectionSection walletAddress={walletAddress} />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">How Your Project Will Appear</h3>
            <ProjectPreview state={state} />
            
            <div className="mt-6 space-y-4">
              <ShareableLink state={state} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleLaunch}
          disabled={!canLaunch}
          className={`gap-2 min-w-[200px] transition-all ${
            canLaunch 
              ? 'bg-accent hover:bg-accent/90 text-black font-medium' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLaunching ? (
            <>Launching...</>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Launch Project
            </>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center text-xs text-text/50 border-t border-border pt-4">
        <p>Your project will be deployed to the blockchain and made available for supporters</p>
        {!effectiveWalletAddress && (
          <p className="text-red-400 mt-1">⚠️ Connect your wallet above to launch</p>
        )}
      </div>
    </div>
  );
};
