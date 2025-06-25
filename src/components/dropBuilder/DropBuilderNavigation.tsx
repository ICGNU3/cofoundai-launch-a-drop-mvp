
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react';

interface DropBuilderNavigationProps {
  currentStep: number;
  canProceed: boolean;
  isLaunching: boolean;
  currentTier: string;
  onPrevStep: () => void;
  onNextStep: () => void;
  onLaunchDrop: () => void;
  onSaveDraft: () => void;
}

export const DropBuilderNavigation: React.FC<DropBuilderNavigationProps> = ({
  currentStep,
  canProceed,
  isLaunching,
  currentTier,
  onPrevStep,
  onNextStep,
  onLaunchDrop,
  onSaveDraft
}) => {
  const STEPS_LENGTH = 5;

  return (
    <div className="flex justify-between items-center">
      <div>
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={onPrevStep}
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
          onClick={onSaveDraft}
          disabled={isLaunching}
          className="bg-surface-elevated border-border hover:bg-card text-text-secondary hover:text-text-primary transition-all duration-300"
        >
          Save Draft
        </Button>

        {currentStep < STEPS_LENGTH ? (
          <Button
            onClick={onNextStep}
            disabled={!canProceed || isLaunching}
            className="gap-2 bg-gradient-to-r from-accent to-gradient-end hover:from-accent-hover hover:to-gradient-end/90 text-white shadow-button hover:shadow-button-hover transition-all duration-300"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={onLaunchDrop}
            disabled={!canProceed || isLaunching || currentTier === 'free'}
            className="gap-2 bg-gradient-to-r from-crypto-green to-crypto-blue hover:from-crypto-green/90 hover:to-crypto-blue/90 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300"
          >
            <Rocket className="w-4 h-4" />
            {isLaunching ? 'Launching...' : 'Launch Drop'}
          </Button>
        )}
      </div>
    </div>
  );
};
