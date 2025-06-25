import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { MediaUploadStep } from './dropBuilder/MediaUploadStep';
import { TokenConfigStep } from './dropBuilder/TokenConfigStep';
import { RewardsConfigStep } from './dropBuilder/RewardsConfigStep';
import { CampaignPreviewStep } from './dropBuilder/CampaignPreviewStep';
import { LaunchStep } from './dropBuilder/LaunchStep';
import { PricingPlans } from './PricingPlans';
import { PaymentGate } from './PaymentGate';
import { useDropBuilder, DropData } from '@/hooks/useDropBuilder';
import { usePayment } from '@/hooks/usePayment';
import { DropBuilderHeader } from './dropBuilder/DropBuilderHeader';
import { DropBuilderProgressSteps } from './dropBuilder/DropBuilderProgressSteps';
import { DropBuilderNavigation } from './dropBuilder/DropBuilderNavigation';

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
          <DropBuilderHeader
            currentTier={currentTier}
            currentStep={currentStep}
            onShowPricing={() => setShowPricing(true)}
            onAIRecommendations={handleAIRecommendations}
          />

          {/* Progress Steps */}
          <DropBuilderProgressSteps currentStep={currentStep} />

          {/* Step Content */}
          <Card className="mb-8 bg-surface-elevated/50 backdrop-blur-sm border-border shadow-card">
            <CardContent className="p-8 md:p-12">
              <div className="animate-fade-in">
                {renderStepContent()}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <DropBuilderNavigation
            currentStep={currentStep}
            canProceed={canProceed}
            isLaunching={isLaunching}
            currentTier={currentTier}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onLaunchDrop={launchDrop}
            onSaveDraft={saveDraft}
          />
        </div>
      </div>
    </div>
  );
};
