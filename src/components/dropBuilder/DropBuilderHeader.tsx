
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap } from 'lucide-react';
import { AIAssistantButton } from '../ai/AIAssistantButton';
import { DropData } from '@/hooks/useDropBuilder';

interface DropBuilderHeaderProps {
  currentTier: string;
  currentStep: number;
  onShowPricing: () => void;
  onAIRecommendations: (recommendations: Partial<DropData>) => void;
}

export const DropBuilderHeader: React.FC<DropBuilderHeaderProps> = ({
  currentTier,
  currentStep,
  onShowPricing,
  onAIRecommendations
}) => {
  return (
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
            onClick={onShowPricing}
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
          <AIAssistantButton onRecommendationsApplied={onAIRecommendations} />
          <p className="text-sm text-text-muted mt-3 max-w-md mx-auto">
            Let AI analyze your project and create the perfect launch strategy tailored to your goals
          </p>
        </div>
      )}
    </div>
  );
};
