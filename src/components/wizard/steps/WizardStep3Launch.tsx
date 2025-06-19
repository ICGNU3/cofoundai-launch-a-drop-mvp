
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Zap, CheckCircle, Eye, ExternalLink, Copy, Share2, Wallet } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccount, useConnect } from 'wagmi';
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
  const [showPreview, setShowPreview] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  
  // Add wagmi hooks for wallet connection
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();

  // Use wagmi address if available, fallback to prop
  const effectiveWalletAddress = address || walletAddress;
  
  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amountUSDC, 0);
  const pledgeAmount = parseInt(state.pledgeUSDC) || 0;

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

  const mockProjectUrl = `https://yourapp.com/project/${state.projectIdea.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`;

  const ProjectPreview = () => (
    <Card className="border-accent/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"></div>
            <span className="font-medium">{state.projectType} Project</span>
          </div>
          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Live Preview</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">
            {state.projectIdea.split(' ').slice(0, 8).join(' ')}
            {state.projectIdea.split(' ').length > 8 && '...'}
          </h3>
          <p className="text-sm text-text/70 line-clamp-3">{state.projectIdea}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span>Target: ${totalExpenses.toLocaleString()}</span>
          <span>Raised: ${pledgeAmount.toLocaleString()}</span>
        </div>
        
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((pledgeAmount / totalExpenses) * 100, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-text/60">
            {state.roles.length} {state.roles.length === 1 ? 'member' : 'members'}
          </div>
          <div className="text-xs text-text/60">
            {state.mode} project
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
          {/* Project Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-text/70">Project Type:</span>
                  <span className="font-medium">{state.projectType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text/70">Mode:</span>
                  <span className="font-medium capitalize">{state.mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text/70">Team Members:</span>
                  <span className="font-medium">{state.roles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text/70">Budget Items:</span>
                  <span className="font-medium">{state.expenses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text/70">Total Budget:</span>
                  <span className="font-medium">${totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text/70">Your Pledge:</span>
                  <span className="font-medium">${pledgeAmount.toLocaleString()}</span>
                </div>
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
                    Customize vesting, utility, and distribution parameters
                  </p>
                </div>
                <Switch
                  checked={state.doAdvancedToken}
                  onCheckedChange={(checked) => updateField("doAdvancedToken", checked)}
                />
              </div>
              
              {!state.doAdvancedToken && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Using default settings:</strong> Standard ERC-20 token with immediate distribution 
                    and revenue sharing based on your team splits.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Wallet Connection & Launch Readiness */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Wallet Connection & Launch Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Wallet Connection Section */}
                {!effectiveWalletAddress ? (
                  <div className="p-4 border border-border rounded-lg bg-surface/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-5 h-5 rounded-full border-2 border-red-500"></div>
                      <span className="text-sm font-medium">Wallet Connection Required</span>
                    </div>
                    <p className="text-xs text-text/60 mb-4">
                      Connect your wallet to deploy your project to the blockchain
                    </p>
                    <div className="space-y-2">
                      {connectors.map((connector) => (
                        <Button
                          key={connector.uid}
                          onClick={() => connect({ connector })}
                          disabled={isPending}
                          variant="outline"
                          className="w-full gap-2"
                        >
                          <Wallet className="w-4 h-4" />
                          {isPending ? 'Connecting...' : `Connect ${connector.name}`}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Wallet Connected</span>
                      <span className="text-xs text-text/60 font-mono">
                        {effectiveWalletAddress.slice(0, 6)}...{effectiveWalletAddress.slice(-4)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Project Configuration Complete</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Ready for Blockchain Deployment</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">How Your Project Will Appear</h3>
            <ProjectPreview />
            
            <div className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Shareable Link</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 p-2 bg-background border rounded">
                    <input 
                      type="text" 
                      value={mockProjectUrl} 
                      readOnly 
                      className="flex-1 bg-transparent text-sm outline-none"
                    />
                    <Button size="sm" variant="ghost">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-text/60 mt-2">
                    This link will be available after launch for sharing with supporters
                  </p>
                </CardContent>
              </Card>
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
