
import React, { useState } from "react";
import { AdvancedTokenCustomizationController } from "./AdvancedTokenCustomizationController";
import { TokenCustomizationSteps } from "./TokenCustomizationSteps";

// Token customization master component (fits Zora V4 extensible principles)
const AdvancedTokenCustomization: React.FC<{
  initialState?: any;
  onStateChange?: (state: any) => void;
  showNav?: boolean;
}> = ({
  initialState,
  onStateChange,
  showNav = true,
}) => {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-xl mx-auto p-6 bg-surface border border-border rounded-xl shadow-card-elevated mt-10 space-y-6">
      <h1 className="text-2xl font-bold headline text-headline text-center mb-2">Advanced Token Customization</h1>
      <div className="text-tagline text-center mb-4">
        Customize your project's token with features inspired by Zora V4 modular standards. Each field has helpful guides!
      </div>
      
      <AdvancedTokenCustomizationController
        initialState={initialState}
        onStateChange={onStateChange}
      >
        {({ state, updateState, canProceed }) => (
          <TokenCustomizationSteps
            step={step}
            state={state}
            updateState={updateState}
            onStepChange={setStep}
          />
        )}
      </AdvancedTokenCustomizationController>
      
      {!showNav && null}
    </div>
  );
};

export default AdvancedTokenCustomization;
