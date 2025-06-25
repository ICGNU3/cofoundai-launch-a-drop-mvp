
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, ArrowUp, Zap, Crown } from 'lucide-react';
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
    <div className="space-y-8">
      <Card className="border-warning/30 bg-gradient-to-br from-warning/5 to-crypto-orange/5 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-warning to-crypto-orange rounded-3xl flex items-center justify-center shadow-glow">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent to-gradient-end rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-text-primary mb-2">Premium Feature</CardTitle>
          <p className="text-text-secondary">Unlock advanced capabilities with a premium plan</p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="p-6 bg-surface-elevated/50 rounded-2xl border border-border">
            <p className="text-text-primary mb-2">
              <strong className="text-warning">{featureName}</strong> requires the{' '}
              <strong className="text-accent">{requiredPlan?.name}</strong> plan or higher.
            </p>
            <p className="text-sm text-text-muted">
              You're currently on the <strong className="text-text-secondary capitalize">{currentTier}</strong> plan.
            </p>
          </div>
          
          <Button
            onClick={() => initializePayment(requiredTier)}
            className="gap-3 bg-gradient-to-r from-warning to-crypto-orange hover:from-warning/90 hover:to-crypto-orange/90 text-white shadow-button hover:shadow-button-hover transition-all duration-300 px-8 py-4 text-lg font-semibold"
            size="lg"
          >
            <ArrowUp className="w-5 h-5" />
            Upgrade to {requiredPlan?.name}
            <Zap className="w-5 h-5" />
          </Button>
        </CardContent>
      </Card>

      {showPricing && (
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-text-primary mb-4">Choose Your Plan</h3>
            <p className="text-lg text-text-secondary">Select the perfect plan for your creative journey</p>
          </div>
          <PricingPlans />
        </div>
      )}
    </div>
  );
};
