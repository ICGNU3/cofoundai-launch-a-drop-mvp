

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Rocket, Sparkles, Zap } from 'lucide-react';
import { MediaUploadStep } from './dropBuilder/MediaUploadStep';
import { TokenConfigStep } from './dropBuilder/TokenConfigStep';
import { RewardsConfigStep } from './dropBuilder/RewardsConfigStep';
import { CampaignPreviewStep } from './dropBuilder/CampaignPreviewStep';
import { LaunchStep } from './dropBuilder/LaunchStep';
import { PricingPlans } from './PricingPlans';
import { PaymentGate } from './PaymentGate';
import { useDropBuilder, DropData } from '@/hooks/useDropBuilder';
import { usePayment } from '@/hooks/usePayment';
import { AIAssistantButton } from './ai/AIAssistantButton';

const STEPS = [
  { id: 1, title: 'Upload Media', description: 'Add your creative content', icon: '🎨' },
  { id: 2, title: 'Token Setup', description: 'Configure your token details', icon: '⚙️' },
  { id: 3, title: 'Supporter Rewards', description: 'Define exclusive perks', icon: '🎁' },
  { id: 4, title: 'Preview Campaign', description: 'Review before launch', icon: '👀' },
  { id: 5, title: 'Launch', description: 'Deploy to Zora', icon: '🚀' }
];

export const DropBuilderFlow: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    dropData,
    updateDropData,
    nextStep,
    prevStep,
    canProceed,
    isLaunching,
    launchDrop,
    saveDraft,
    getMediaLimit,
    canUseAdvancedTokens,
    canUseCustomRewards
  } = useDropBuilder();

  const { currentTier, verifyPayment } = usePayment();
  const [showPricing, setShowPricing] = useState(false);

  // Verify payment on component mount
  React.useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  const handleAIRecommendations = (recommendations: Partial<DropData>) => {
    // Apply AI recommendations to the drop data
    updateDropData(recommendations);
    
    // If we have token config, skip to step 3 (rewards)
    if (recommendations.tokenConfig && recommendations.rewards) {
      setCurrentStep(3);
    } else if (recommendations.tokenConfig) {
      setCurrentStep(2);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <MediaUploadStep
            media={dropData.media}
            onMediaUpdate={(media) => updateDropData({ media })}
            mediaLimit={getMediaLimit()}
          />
        );
      case 2:
        return (
          <TokenConfigStep
            tokenConfig={dropData.tokenConfig}
            onConfigUpdate={(tokenConfig) => updateDropData({ tokenConfig })}
            canUseAdvanced={canUseAdvancedTokens()}
          />
        );
      case 3:
        return (
          <RewardsConfigStep
            rewards={dropData.rewards}
            onRewardsUpdate={(rewards) => updateDropData({ rewards })}
            canUseCustom={canUseCustomRewards()}
          />
        );
      case 4:
        return (
          <CampaignPreviewStep
            dropData={dropData}
            onEdit={(step) => setCurrentStep(step)}
          />
        );
      case 5:
        return currentTier === 'free' ? (
          <PaymentGate 
            requiredTier="pro" 
            featureName="Drop Launch"
            showPricing={true}
          >
            <LaunchStep
              dropData={dropData}
              onLaunch={launchDrop}
              isLaunching={isLaunching}
            />
          </PaymentGate>
        ) : (
          <LaunchStep
            dropData={dropData}
            onLaunch={launchDrop}
            isLaunching={isLaunching}
          />
        );
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  if (showPricing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
        <div className="absolute inset-0 bg-gradient-aurora opacity-5" />
        <div className="relative z-10 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent/20 to-gradient-end/20 rounded-pill border border-accent/30 mb-6">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Premium Plans</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-text-primary mb-4">
                Choose Your Plan
              </h1>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                Select the plan that best fits your creative needs and unlock powerful features
              </p>
            </div>
            
            <PricingPlans />
            
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                onClick={() => setShowPricing(false)}
                className="bg-surface-elevated border-border hover:bg-card text-text-secondary hover:text-text-primary transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Drop Builder
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-aurora opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent/20 to-gradient-end/20 rounded-pill border border-accent/30 mb-6">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Drop Builder</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-headline text-text-primary mb-4">
                  Create Your Drop
                </h1>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-text-muted">Current Plan</div>
                  <div className="text-lg font-semibold text-text-primary capitalize">{currentTier}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPricing(true)}
                  className="bg-surface-elevated border-border hover:bg-card text-text-secondary hover:text-text-primary transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  View Plans
                </Button>
              </div>
            </div>
            
            <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
              Launch your creative project in 5 simple steps with our guided builder
            </p>
            
            {/* AI Assistant Button */}
            {currentStep === 1 && (
              <div className="mb-8">
                <AIAssistantButton onRecommendationsApplied={handleAIRecommendations} />
                <p className="text-sm text-text-muted mt-3 max-w-md mx-auto">
                  Let AI analyze your project and create the perfect launch strategy tailored to your goals
                </p>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between items-start mb-8">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative">
                  {/* Step Circle */}
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                        step.id <= currentStep
                          ? 'bg-gradient-to-r from-accent to-gradient-end text-white shadow-glow'
                          : 'bg-surface-elevated border-2 border-border text-text-muted'
                      }`}
                    >
                      {step.id <= currentStep ? (
                        <span className="text-xl">{step.icon}</span>
                      ) : (
                        <span className="text-lg font-bold">{step.id}</span>
                      )}
                    </div>
                    {step.id === currentStep && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent to-gradient-end opacity-30 animate-pulse" />
                    )}
                  </div>
                  
                  {/* Step Info */}
                  <div className="text-center mt-4 max-w-32">
                    <p className={`text-sm font-semibold ${
                      step.id <= currentStep ? 'text-text-primary' : 'text-text-muted'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Connector Line */}
                  {index < STEPS.length - 1 && (
                    <div className="absolute top-7 left-14 w-full h-0.5 -z-10">
                      <div className="h-full bg-border" />
                      <div 
                        className={`h-full bg-gradient-to-r from-accent to-gradient-end transition-all duration-500 ${
                          step.id < currentStep ? 'w-full' : 'w-0'
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="relative">
              <Progress 
                value={progressPercentage} 
                className="h-3 bg-surface-elevated border border-border"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-gradient-end opacity-20 rounded-full" />
            </div>
          </div>

          {/* Step Content */}
          <Card className="mb-8 bg-surface-elevated/50 backdrop-blur-sm border-border shadow-card">
            <CardContent className="p-8 md:p-12">
              <div className="animate-fade-in">
                {renderStepContent()}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="gap-2 bg-surface-elevated border-border hover:bg-card text-text-secondary hover:text-text-primary transition-all duration-300"
                  disabled={isLaunching}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={saveDraft}
                disabled={isLaunching}
                className="bg-surface-elevated border-border hover:bg-card text-text-secondary hover:text-text-primary transition-all duration-300"
              >
                Save Draft
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed || isLaunching}
                  className="gap-2 bg-gradient-to-r from-accent to-gradient-end hover:from-accent-hover hover:to-gradient-end/90 text-white shadow-button hover:shadow-button-hover transition-all duration-300"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={launchDrop}
                  disabled={!canProceed || isLaunching || currentTier === 'free'}
                  className="gap-2 bg-gradient-to-r from-crypto-green to-crypto-blue hover:from-crypto-green/90 hover:to-crypto-blue/90 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300"
                >
                  <Rocket className="w-4 h-4" />
                  {isLaunching ? 'Launching...' : 'Launch Drop'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
