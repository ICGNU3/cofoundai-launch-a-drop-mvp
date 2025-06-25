
import React from 'react';
import { Progress } from '@/components/ui/progress';

const STEPS = [
  { id: 1, title: 'Upload Media', description: 'Add your creative content', icon: '🎨' },
  { id: 2, title: 'Token Setup', description: 'Configure your token details', icon: '⚙️' },
  { id: 3, title: 'Supporter Rewards', description: 'Define exclusive perks', icon: '🎁' },
  { id: 4, title: 'Preview Campaign', description: 'Review before launch', icon: '👀' },
  { id: 5, title: 'Launch', description: 'Deploy to Zora', icon: '🚀' }
];

interface DropBuilderProgressStepsProps {
  currentStep: number;
}

export const DropBuilderProgressSteps: React.FC<DropBuilderProgressStepsProps> = ({
  currentStep
}) => {
  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
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
  );
};
