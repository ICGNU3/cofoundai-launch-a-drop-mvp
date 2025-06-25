
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Star } from 'lucide-react';
import { usePayment, PricingTier } from '@/hooks/usePayment';

interface PricingPlansProps {
  onSelectPlan?: (tier: PricingTier) => void;
  showCurrentPlan?: boolean;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({
  onSelectPlan,
  showCurrentPlan = false
}) => {
  const { currentTier, initializePayment, isProcessing, PRICING_PLANS } = usePayment();

  const handleSelectPlan = (tier: PricingTier) => {
    if (onSelectPlan) {
      onSelectPlan(tier);
    } else {
      initializePayment(tier);
    }
  };

  const getTierIcon = (tier: PricingTier) => {
    switch (tier) {
      case 'free':
        return <Zap className="w-6 h-6" />;
      case 'pro':
        return <Crown className="w-6 h-6" />;
      case 'advisory':
        return <Star className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const formatPrice = (price: number, interval?: string) => {
    if (price === 0) return 'Free';
    return `$${price.toLocaleString()}${interval === 'monthly' ? '/mo' : ''}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {PRICING_PLANS.map((plan) => (
        <Card
          key={plan.id}
          className={`relative ${
            plan.popular
              ? 'border-blue-500 shadow-lg scale-105'
              : 'border-gray-200'
          } ${
            currentTier === plan.id && showCurrentPlan
              ? 'ring-2 ring-green-500'
              : ''
          }`}
        >
          {plan.popular && (
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
              Most Popular
            </Badge>
          )}
          
          {currentTier === plan.id && showCurrentPlan && (
            <Badge className="absolute -top-3 right-4 bg-green-500">
              Current Plan
            </Badge>
          )}

          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              {getTierIcon(plan.id)}
            </div>
            <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
            <div className="text-3xl font-bold text-blue-600">
              {formatPrice(plan.price, plan.interval)}
            </div>
            {plan.interval && (
              <p className="text-sm text-gray-500">
                {plan.interval === 'monthly' ? 'Billed monthly' : 'One-time payment'}
              </p>
            )}
          </CardHeader>

          <CardContent>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={plan.popular ? 'default' : 'outline'}
              onClick={() => handleSelectPlan(plan.id)}
              disabled={isProcessing || (currentTier === plan.id && showCurrentPlan)}
            >
              {isProcessing ? 'Processing...' : 
               currentTier === plan.id && showCurrentPlan ? 'Current Plan' :
               plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
