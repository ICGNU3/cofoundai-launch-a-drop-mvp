
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CheckCircle } from "lucide-react";
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";

interface TokenConfigurationCardProps {
  state: StreamlinedWizardState;
  updateField: <K extends keyof StreamlinedWizardState>(field: K, value: StreamlinedWizardState[K]) => void;
  isLaunching: boolean;
  isMinting: boolean;
}

export const TokenConfigurationCard: React.FC<TokenConfigurationCardProps> = ({
  state,
  updateField,
  isLaunching,
  isMinting,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Token Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Advanced Token Settings</h4>
            <p className="text-xs text-text/60">
              Customize vesting, utility, and distribution
            </p>
          </div>
          <Switch
            checked={state.doAdvancedToken}
            onCheckedChange={(checked) => updateField("doAdvancedToken", checked)}
            disabled={isLaunching || isMinting}
          />
        </div>
        
        {!state.doAdvancedToken && (
          <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Default NEPLUS Coin Settings</span>
            </div>
            <ul className="text-xs text-text/60 space-y-1">
              <li>• Standard ERC-20 token (NPLUS)</li>
              <li>• Revenue sharing based on team splits</li>
              <li>• Immediate distribution</li>
              <li>• 5% creator royalties on trading</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
