
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePayment } from './usePayment';

export interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
  ipfsHash?: string;
}

export interface TokenConfig {
  name: string;
  symbol: string;
  totalSupply: string;
  description: string;
  price: string;
}

export interface SupporterReward {
  id: string;
  type: 'early_merch' | 'digital_access' | 'exclusive_content' | 'meet_greet' | 'custom';
  title: string;
  description: string;
  tokenThreshold: number;
  customDetails?: string;
}

export interface DropData {
  media: MediaFile[];
  tokenConfig: TokenConfig;
  rewards: SupporterReward[];
  metadata?: any;
  launchConfig?: any;
}

const initialDropData: DropData = {
  media: [],
  tokenConfig: {
    name: '',
    symbol: '',
    totalSupply: '1000000',
    description: '',
    price: '0.001'
  },
  rewards: []
};

export function useDropBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [dropData, setDropData] = useState<DropData>(initialDropData);
  const [isLaunching, setIsLaunching] = useState(false);
  const { toast } = useToast();
  const { canAccessTier, hasFeatureAccess } = usePayment();

  const updateDropData = useCallback((updates: Partial<DropData>) => {
    setDropData(prev => ({ ...prev, ...updates }));
  }, []);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        // Free tier: max 3 media files, Pro/Advisory: unlimited
        if (!canAccessTier('pro') && dropData.media.length > 3) {
          return false;
        }
        return dropData.media.length > 0;
      case 2:
        return dropData.tokenConfig.name && 
               dropData.tokenConfig.symbol && 
               dropData.tokenConfig.totalSupply;
      case 3:
        // Free tier: basic rewards only, Pro/Advisory: custom rewards
        return dropData.rewards.length > 0;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  }, [currentStep, dropData, canAccessTier]);

  const getMediaLimit = useCallback(() => {
    return canAccessTier('pro') ? null : 3; // null = unlimited, 3 = free tier limit
  }, [canAccessTier]);

  const canUseAdvancedTokens = useCallback(() => {
    return hasFeatureAccess('Advanced token customization');
  }, [hasFeatureAccess]);

  const canUseCustomRewards = useCallback(() => {
    return hasFeatureAccess('Custom rewards setup');
  }, [hasFeatureAccess]);

  const nextStep = useCallback(() => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  }, [canProceed, currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const saveDraft = useCallback(async () => {
    try {
      const draftKey = `drop_draft_${Date.now()}`;
      localStorage.setItem(draftKey, JSON.stringify(dropData));
      
      toast({
        title: "Draft Saved",
        description: "Your drop has been saved locally",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save draft",
        variant: "destructive",
      });
    }
  }, [dropData, toast]);

  const launchDrop = useCallback(async () => {
    if (!canAccessTier('pro')) {
      toast({
        title: "Upgrade Required",
        description: "Pro Launch tier required to deploy drops",
        variant: "destructive",
      });
      return;
    }

    setIsLaunching(true);
    try {
      // Here you would integrate with Zora SDK
      console.log('Launching drop with data:', dropData);
      
      // Simulate launch process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Drop Launched Successfully!",
        description: "Your drop is now live on Zora",
      });
      
      // Save launch config
      const launchConfig = {
        ...dropData,
        launchedAt: new Date().toISOString(),
        status: 'live'
      };
      
      localStorage.setItem('last_launch_config', JSON.stringify(launchConfig));
      
    } catch (error) {
      console.error('Launch failed:', error);
      toast({
        title: "Launch Failed",
        description: "There was an error launching your drop",
        variant: "destructive",
      });
    } finally {
      setIsLaunching(false);
    }
  }, [dropData, toast, canAccessTier]);

  return {
    currentStep,
    setCurrentStep,
    dropData,
    updateDropData,
    nextStep,
    prevStep,
    canProceed: canProceed(),
    isLaunching,
    launchDrop,
    saveDraft,
    // Payment-related features
    getMediaLimit,
    canUseAdvancedTokens,
    canUseCustomRewards,
    canAccessTier
  };
}
