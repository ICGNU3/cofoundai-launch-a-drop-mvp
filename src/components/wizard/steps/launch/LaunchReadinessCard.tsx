
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2, XCircle } from "lucide-react";
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";

interface ValidationCheck {
  id: string;
  label: string;
  isValid: boolean;
  detail: string;
}

interface LaunchReadinessCardProps {
  state: StreamlinedWizardState;
  walletAddress: string | null;
  isLaunching: boolean;
}

export const LaunchReadinessCard: React.FC<LaunchReadinessCardProps> = ({
  state,
  walletAddress,
  isLaunching,
}) => {
  const expenseSum = state.expenses.reduce((sum, exp) => sum + exp.amountUSDC, 0);

  const validationChecks: ValidationCheck[] = [
    {
      id: 'wallet',
      label: 'Wallet Connected',
      isValid: !!walletAddress,
      detail: walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'No wallet connected'
    },
    {
      id: 'project',
      label: 'Project Configuration Complete',
      isValid: state.projectIdea.trim().length >= 10 && !!state.projectType,
      detail: state.projectIdea.trim().length >= 10 ? 'Project details validated' : 'Project details incomplete'
    },
    {
      id: 'team',
      label: 'Team Setup Valid',
      isValid: state.roles.length > 0 && state.roles.reduce((sum, role) => sum + role.percent, 0) === 100,
      detail: `${state.roles.length} member(s), ${state.roles.reduce((sum, role) => sum + role.percent, 0)}% allocated`
    },
    {
      id: 'budget',
      label: 'Budget Configuration',
      isValid: state.expenses.length > 0 && expenseSum > 0,
      detail: `${state.expenses.length} item(s), $${expenseSum.toLocaleString()} total`
    }
  ];

  const allValidationsPassed = validationChecks.every(check => check.isValid);

  const getValidationIcon = (isValid: boolean, isLoading: boolean = false) => {
    if (isLoading) return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    if (isValid) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          Launch Readiness
          {allValidationsPassed ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {validationChecks.map((check) => (
            <div key={check.id} className="flex items-center gap-3">
              {getValidationIcon(check.isValid, isLaunching && check.id === 'wallet')}
              <div className="flex-1">
                <span className={`text-sm ${check.isValid ? 'text-text' : 'text-red-600'}`}>
                  {check.label}
                </span>
                <span className={`text-xs ml-2 ${check.isValid ? 'text-text/60' : 'text-red-500'}`}>
                  {check.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {!allValidationsPassed && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              Please resolve the validation issues above before launching your project.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
