
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface OnboardingContextType {
  isOnboardingActive: boolean;
  currentStep: number;
  onboardingSteps: OnboardingStep[];
  isDemoMode: boolean;
  hasCompletedOnboarding: boolean;
  startOnboarding: () => void;
  nextStep: () => void;
  previousStep: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  toggleDemoMode: () => void;
  setTargetElement: (element: HTMLElement | null) => void;
  targetElement: HTMLElement | null;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

const TRADING_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to NEPLUS Trading!',
    description: 'Let\'s take a quick tour of the trading interface. You can practice in demo mode first.',
    target: 'trading-interface',
    position: 'bottom'
  },
  {
    id: 'demo-mode',
    title: 'Demo Mode',
    description: 'Toggle demo mode to practice trading with virtual funds. No real money at risk!',
    target: 'demo-toggle',
    position: 'bottom'
  },
  {
    id: 'token-selection',
    title: 'Select Tokens',
    description: 'Choose which tokens you want to trade. Each token represents a creative project.',
    target: 'token-selector',
    position: 'right'
  },
  {
    id: 'swap-form',
    title: 'Trading Form',
    description: 'Enter the amount you want to trade and preview the exchange rate.',
    target: 'swap-form',
    position: 'left'
  },
  {
    id: 'slippage',
    title: 'Slippage Settings',
    description: 'Adjust slippage tolerance to control price movement during your trade.',
    target: 'slippage-settings',
    position: 'top'
  },
  {
    id: 'price-chart',
    title: 'Price Analytics',
    description: 'Monitor real-time price movements and trading volume to make informed decisions.',
    target: 'price-chart',
    position: 'left'
  }
];

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  // Check if user should see onboarding
  useEffect(() => {
    if (user && profile) {
      const onboardingCompleted = localStorage.getItem(`onboarding_completed_${user.id}`);
      const completed = onboardingCompleted === 'true';
      setHasCompletedOnboarding(completed);
      
      // Auto-start onboarding for new users on trading pages
      if (!completed && (window.location.pathname.includes('/trading') || window.location.pathname.includes('/dashboard'))) {
        setTimeout(() => {
          setIsOnboardingActive(true);
        }, 1000);
      }
    }
  }, [user, profile]);

  const startOnboarding = () => {
    setCurrentStep(0);
    setIsOnboardingActive(true);
    setIsDemoMode(true);
  };

  const nextStep = () => {
    if (currentStep < TRADING_ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    setIsOnboardingActive(false);
    setHasCompletedOnboarding(true);
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

  const value = {
    isOnboardingActive,
    currentStep,
    onboardingSteps: TRADING_ONBOARDING_STEPS,
    isDemoMode,
    hasCompletedOnboarding,
    startOnboarding,
    nextStep,
    previousStep,
    completeOnboarding,
    skipOnboarding,
    toggleDemoMode,
    setTargetElement,
    targetElement
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
