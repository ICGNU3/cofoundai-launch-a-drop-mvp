
import React from 'react';
import { PricingPlans } from '@/components/PricingPlans';
import { usePayment } from '@/hooks/usePayment';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function Pricing() {
  const { currentTier } = usePayment();

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your creative journey. From free drops to professional launches with ongoing support.
          </p>
        </div>

        {/* Current Plan Status */}
        {currentTier !== 'free' && (
          <Card className="mb-12 border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-lg font-semibold text-green-800">
                  You're on the {currentTier} plan
                </span>
              </div>
              <p className="text-green-600">
                Enjoying all the benefits of your subscription
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pricing Plans */}
        <PricingPlans showCurrentPlan={true} />

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major cryptocurrencies on Base network, as well as traditional payment methods through our payment partners.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your Advisory subscription at any time. Your access will continue until the end of your current billing period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What's included in concierge onboarding?
              </h3>
              <p className="text-gray-600">
                Personal 1-on-1 setup session, drop optimization, marketing strategy consultation, and technical support for your launch.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for Pro Launch purchases if you're not satisfied with the service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
