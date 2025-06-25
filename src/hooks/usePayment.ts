
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export type PricingTier = 'free' | 'pro' | 'advisory';

export interface PricingPlan {
  id: PricingTier;
  name: string;
  price: number;
  interval?: 'monthly' | 'one-time';
  features: string[];
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'one-time',
    features: [
      'Basic drop creation',
      'Up to 3 media files',
      'Standard token configuration',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Launch',
    price: 999,
    interval: 'one-time',
    popular: true,
    features: [
      'Unlimited media uploads',
      'Advanced token customization',
      'Concierge onboarding',
      'Priority support',
      'Custom rewards setup',
      'Launch optimization'
    ]
  },
  {
    id: 'advisory',
    name: 'Advisory',
    price: 250,
    interval: 'monthly',
    features: [
      'All Pro features',
      'Ongoing analytics dashboard',
      'Monthly strategy calls',
      'Performance optimization',
      'Market insights',
      'Dedicated account manager'
    ]
  }
];

export interface PaymentSession {
  id: string;
  tier: PricingTier;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  createdAt: Date;
  expiresAt: Date;
}

export function usePayment() {
  const [currentTier, setCurrentTier] = useState<PricingTier>('free');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const { toast } = useToast();

  const initializePayment = useCallback(async (tier: PricingTier) => {
    if (tier === 'free') {
      setCurrentTier('free');
      return;
    }

    setIsProcessing(true);
    try {
      // Create payment session
      const session: PaymentSession = {
        id: `session_${Date.now()}`,
        tier,
        status: 'pending',
        amount: PRICING_PLANS.find(p => p.id === tier)?.price || 0,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      };

      setPaymentSession(session);

      // Simulate payment processing (replace with actual payment integration)
      console.log('Initializing payment for tier:', tier);
      
      toast({
        title: "Payment Initialized",
        description: `Starting payment process for ${tier} tier`,
      });

      // In a real implementation, this would redirect to payment provider
      // For now, we'll simulate a successful payment after 3 seconds
      setTimeout(() => {
        completePayment(session.id);
      }, 3000);

    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast({
        title: "Payment Failed",
        description: "Could not initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const completePayment = useCallback((sessionId: string) => {
    if (paymentSession?.id === sessionId) {
      setPaymentSession(prev => prev ? { ...prev, status: 'completed' } : null);
      setCurrentTier(paymentSession.tier);
      
      // Store payment confirmation locally
      localStorage.setItem('neplus_payment_tier', paymentSession.tier);
      localStorage.setItem('neplus_payment_session', JSON.stringify({
        ...paymentSession,
        status: 'completed'
      }));

      toast({
        title: "Payment Successful!",
        description: `Welcome to ${PRICING_PLANS.find(p => p.id === paymentSession.tier)?.name} tier`,
      });
    }
  }, [paymentSession, toast]);

  const verifyPayment = useCallback(() => {
    // Check local storage for payment verification
    const storedTier = localStorage.getItem('neplus_payment_tier') as PricingTier;
    const storedSession = localStorage.getItem('neplus_payment_session');
    
    if (storedTier && storedSession) {
      try {
        const session = JSON.parse(storedSession) as PaymentSession;
        if (session.status === 'completed') {
          setCurrentTier(storedTier);
          setPaymentSession(session);
          return true;
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
      }
    }
    
    return false;
  }, []);

  const hasFeatureAccess = useCallback((feature: string) => {
    const currentPlan = PRICING_PLANS.find(p => p.id === currentTier);
    return currentPlan?.features.includes(feature) || false;
  }, [currentTier]);

  const canAccessTier = useCallback((tier: PricingTier) => {
    if (tier === 'free') return true;
    
    const tierIndex = PRICING_PLANS.findIndex(p => p.id === tier);
    const currentIndex = PRICING_PLANS.findIndex(p => p.id === currentTier);
    
    return currentIndex >= tierIndex;
  }, [currentTier]);

  return {
    currentTier,
    paymentSession,
    isProcessing,
    initializePayment,
    completePayment,
    verifyPayment,
    hasFeatureAccess,
    canAccessTier,
    PRICING_PLANS
  };
}
