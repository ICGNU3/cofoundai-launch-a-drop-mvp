
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowRight, ArrowLeft, X, Play } from 'lucide-react';

export function OnboardingTooltip() {
  const {
    isOnboardingActive,
    currentStep,
    onboardingSteps,
    nextStep,
    previousStep,
    completeOnboarding,
    targetElement
  } = useOnboarding();

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const currentStepData = onboardingSteps[currentStep];

  useEffect(() => {
    if (!isOnboardingActive || !currentStepData) return;

    const updatePosition = () => {
      const target = document.querySelector(`[data-onboarding="${currentStepData.target}"]`) as HTMLElement;
      
      if (target) {
        const rect = target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        let top = 0;
        let left = 0;

        switch (currentStepData.position) {
          case 'top':
            top = rect.top + scrollTop - 10;
            left = rect.left + scrollLeft + rect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + scrollTop + 10;
            left = rect.left + scrollLeft + rect.width / 2;
            break;
          case 'left':
            top = rect.top + scrollTop + rect.height / 2;
            left = rect.left + scrollLeft - 10;
            break;
          case 'right':
            top = rect.top + scrollTop + rect.height / 2;
            left = rect.right + scrollLeft + 10;
            break;
        }

        setPosition({ top, left });
        setIsVisible(true);

        // Add highlight to target element
        target.style.position = 'relative';
        target.style.zIndex = '1000';
        target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.3)';
        target.style.borderRadius = '8px';
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(updatePosition, 100);

    // Update position on scroll/resize
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      
      // Remove highlight from all elements
      document.querySelectorAll('[data-onboarding]').forEach((el) => {
        const element = el as HTMLElement;
        element.style.boxShadow = '';
        element.style.zIndex = '';
      });
    };
  }, [isOnboardingActive, currentStep, currentStepData]);

  if (!isOnboardingActive || !currentStepData || !isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-[999] pointer-events-none" />
      
      {/* Tooltip */}
      <Card 
        className="fixed z-[1001] max-w-sm bg-card border-border shadow-lg"
        style={{
          top: position.top,
          left: position.left,
          transform: currentStepData.position === 'top' || currentStepData.position === 'bottom' 
            ? 'translateX(-50%)' 
            : currentStepData.position === 'left' 
            ? 'translateX(-100%) translateY(-50%)'
            : 'translateY(-50%)'
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-light tracking-tighter text-text">
              {currentStepData.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-light">
                {currentStep + 1} of {onboardingSteps.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={completeOnboarding}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-text/70 font-light tracking-wide">
            {currentStepData.description}
          </p>
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={previousStep}
              disabled={currentStep === 0}
              className="font-light tracking-wide"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Back
            </Button>
            
            <Button
              onClick={nextStep}
              size="sm"
              className="bg-accent text-black hover:bg-accent/90 font-light tracking-wide"
            >
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Start Trading
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-3 h-3 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
