
import React from "react";
import AdvancedTokenCustomization from "@/components/AdvancedTokenCustomization/AdvancedTokenCustomization";

interface AdvancedTokenCustomizationWrapperProps {
  state: any;
  setTokenCustomization: (tc: any) => void;
  setStep: (n: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export const AdvancedTokenCustomizationWrapper: React.FC<AdvancedTokenCustomizationWrapperProps> = ({
  state,
  setTokenCustomization,
  setStep,
  onBack,
  onNext,
}) => {
  const [local, setLocal] = React.useState(
    state.tokenCustomization || {
      name: "",
      symbol: "",
      tokenType: "erc20",
      totalSupply: 1000000,
      mintingType: "fixed",
      inflationRate: 0,
      deflationRate: 0,
      distribution: { team: 20, treasury: 30, publicSale: 50 },
      vesting: { team: 12, early: 6 },
      utility: { governance: true, access: false, staking: false, custom: "" },
    }
  );

  function handleDone() {
    setTokenCustomization(local);
    onNext();
  }

  return (
    <div>
      <AdvancedTokenCustomization
        initialState={local}
        onStateChange={setLocal}
        showNav={false}
      />
      <div className="flex justify-between mt-6">
        <button className="accent-btn secondary" onClick={onBack}>← Back</button>
        <button className="accent-btn" type="button" onClick={handleDone}>
          Next: Launch
        </button>
      </div>
    </div>
  );
};
