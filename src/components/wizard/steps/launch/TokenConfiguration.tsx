
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";

interface TokenConfigurationProps {
  state: StreamlinedWizardState;
  updateField: <K extends keyof StreamlinedWizardState>(field: K, value: StreamlinedWizardState[K]) => void;
}

export const TokenConfiguration: React.FC<TokenConfigurationProps> = ({ state, updateField }) => {
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
              Customize vesting, utility, and distribution parameters
            </p>
          </div>
          <Switch
            checked={state.doAdvancedToken}
            onCheckedChange={(checked) => updateField("doAdvancedToken", checked)}
          />
        </div>
        
        {!state.doAdvancedToken && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Using default settings:</strong> Standard ERC-20 token with immediate distribution 
              and revenue sharing based on your team splits.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
