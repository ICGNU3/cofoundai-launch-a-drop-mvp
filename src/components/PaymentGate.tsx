
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, ArrowUp } from 'lucide-react';
import { usePayment, PricingTier } from '@/hooks/usePayment';
import { PricingPlans } from './PricingPlans';

interface PaymentGateProps {
  requiredTier: PricingTier;
  featureName: string;
  children: React.ReactNode;
  showPricing?: boolean;
}

export const PaymentGate: React.FC<PaymentGateProps> = ({
  requiredTier,
  featureName,
  children,
  showPricing = false
}) => {
  const { canAccessTier, currentTier, initializePayment, PRICING_PLANS } = usePayment();

  if (canAccessTier(requiredTier)) {
    return <>{children}</>;
  }

  const requiredPlan = PRICING_PLANS.find(p => p.id === requiredTier);

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Lock className="w-12 h-12 text-orange-500" />
          </div>
          <CardTitle className="text-xl">Premium Feature</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            <strong>{featureName}</strong> requires the{' '}
            <strong>{requiredPlan?.name}</strong> plan or higher.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You're currently on the <strong>{currentTier}</strong> plan.
          </p>
          
          <Button
            onClick={() => initializePayment(requiredTier)}
            className="gap-2"
          >
            <ArrowUp className="w-4 h-4" />
            Upgrade to {requiredPlan?.name}
          </Button>
        </CardContent>
      </Card>

      {showPricing && (
        <div>
          <h3 className="text-2xl font-bold text-center mb-6">Choose Your Plan</h3>
          <PricingPlans />
        </div>
      )}
    </div>
  );
};
