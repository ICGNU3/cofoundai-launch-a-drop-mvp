import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react';
import { MediaUploadStep } from './dropBuilder/MediaUploadStep';
import { TokenConfigStep } from './dropBuilder/TokenConfigStep';
import { RewardsConfigStep } from './dropBuilder/RewardsConfigStep';
import { CampaignPreviewStep } from './dropBuilder/CampaignPreviewStep';
import { LaunchStep } from './dropBuilder/LaunchStep';
import { PricingPlans } from './PricingPlans';
import { PaymentGate } from './PaymentGate';
import { useDropBuilder } from '@/hooks/useDropBuilder';
import { usePayment } from '@/hooks/usePayment';
import { AIAssistantButton } from './ai/AIAssistantButton';

const STEPS = [
  { id: 1, title: 'Upload Media', description: 'Add your creative content' },
  { id: 2, title: 'Token Setup', description: 'Configure your token details' },
  { id: 3, title: 'Supporter Rewards', description: 'Define exclusive perks' },
  { id: 4, title: 'Preview Campaign', description: 'Review before launch' },
  { id: 5, title: 'Launch', description: 'Deploy to Zora' }
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
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Choose Your Plan
            </h1>
            <p className="text-lg text-gray-600">
              Select the plan that best fits your creative needs
            </p>
          </div>
          
          <PricingPlans />
          
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => setShowPricing(false)}
            >
              Back to Drop Builder
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Your Drop
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Current Plan: <strong className="capitalize">{currentTier}</strong>
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPricing(true)}
              >
                View Plans
              </Button>
            </div>
          </div>
          <p className="text-lg text-gray-600 mb-4">
            Launch your creative project in 5 simple steps
          </p>
          
          {/* AI Assistant Button */}
          {currentStep === 1 && (
            <div className="mb-6">
              <AIAssistantButton onRecommendationsApplied={handleAIRecommendations} />
              <p className="text-sm text-gray-500 mt-2">
                Let AI help you create the perfect launch strategy
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  index < STEPS.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step.id <= currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.id}
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200 mx-4 mt-5" />
                )}
              </div>
            ))}
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="gap-2"
                disabled={isLaunching}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={saveDraft}
              disabled={isLaunching}
            >
              Save Draft
            </Button>

            {currentStep < STEPS.length ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed || isLaunching}
                className="gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={launchDrop}
                disabled={!canProceed || isLaunching || currentTier === 'free'}
                className="gap-2"
              >
                <Rocket className="w-4 h-4" />
                {isLaunching ? 'Launching...' : 'Launch Drop'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
