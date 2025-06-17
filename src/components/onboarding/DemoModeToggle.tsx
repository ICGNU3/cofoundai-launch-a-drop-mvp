
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Play, Shield, AlertTriangle } from 'lucide-react';

export function DemoModeToggle() {
  const { isDemoMode, toggleDemoMode } = useOnboarding();

  return (
    <Card 
      data-onboarding="demo-toggle"
      className={`bg-card border-border transition-all duration-200 ${
        isDemoMode ? 'border-green-500/50 bg-green-500/5' : 'border-orange-500/50 bg-orange-500/5'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDemoMode ? 'bg-green-500/20' : 'bg-orange-500/20'
            }`}>
              {isDemoMode ? (
                <Play className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-text font-inter font-light tracking-tighter">
                  {isDemoMode ? 'Demo Mode' : 'Live Trading'}
                </span>
                <Badge 
                  variant={isDemoMode ? "default" : "destructive"}
                  className="text-xs font-light"
                >
                  {isDemoMode ? (
                    <>
                      <Shield className="w-3 h-3 mr-1" />
                      Safe Practice
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Real Funds
                    </>
                  )}
                </Badge>
              </div>
              <p className="text-xs text-text/70 font-light tracking-wide">
                {isDemoMode 
                  ? 'Practice trading with virtual funds - no real money at risk'
                  : 'Trading with real cryptocurrency - funds at risk'
                }
              </p>
            </div>
          </div>
          
          <Switch
            checked={isDemoMode}
            onCheckedChange={toggleDemoMode}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </CardContent>
    </Card>
  );
}
