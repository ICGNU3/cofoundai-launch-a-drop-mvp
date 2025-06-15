import React, { useState, useEffect } from "react";
import { TokenNaming } from "./TokenNaming";
import { SupplySchedule } from "./SupplySchedule";
import { TokenTypeSelector } from "./TokenTypeSelector";
import { DistributionVesting } from "./DistributionVesting";
import { TokenUtility } from "./TokenUtility";
import { TokenPreview } from "./TokenPreview";

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
  // Accept external state if controlled
  const [tokenName, setTokenName] = React.useState(initialState?.name || "");
  const [tokenSymbol, setTokenSymbol] = React.useState(initialState?.symbol || "");
  const [tokenType, setTokenType] = React.useState<"erc20" | "erc721">(initialState?.tokenType || "erc20");
  const [totalSupply, setTotalSupply] = React.useState<number>(initialState?.totalSupply || 1000000);
  const [mintingType, setMintingType] = React.useState<"fixed" | "inflation" | "deflation">(initialState?.mintingType || "fixed");
  const [inflationRate, setInflationRate] = React.useState<number>(initialState?.inflationRate || 0);
  const [deflationRate, setDeflationRate] = React.useState<number>(initialState?.deflationRate || 0);

  // Distribution (percentages must sum to 100)
  const [distribution, setDistribution] = React.useState(initialState?.distribution || {
    team: 20,
    treasury: 30,
    publicSale: 50,
  });

  // Vesting (simplified: months)
  const [vesting, setVesting] = React.useState(initialState?.vesting || {
    team: 12,
    early: 6,
  });

  // Utility
  const [utility, setUtility] = React.useState(initialState?.utility || {
    governance: true,
    access: false,
    staking: false,
    custom: "",
  });

  // Step navigation
  const [step, setStep] = React.useState(1);

  // Pass up state on any change
  useEffect(() => {
    onStateChange?.({
      name: tokenName,
      symbol: tokenSymbol,
      tokenType,
      totalSupply,
      mintingType,
      inflationRate,
      deflationRate,
      distribution,
      vesting,
      utility,
    });
    // eslint-disable-next-line
  }, [tokenName, tokenSymbol, tokenType, totalSupply, mintingType, inflationRate, deflationRate, distribution, vesting, utility]);

  // For simulation preview step
  const canProceed = () => {
    // Typecast values as numbers to avoid TypeScript error
    return !!tokenName && !!tokenSymbol && totalSupply > 0 &&
      Object.values(distribution).reduce((a, b) => (a as number) + (b as number), 0) === 100;
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-surface border border-border rounded-xl shadow-card-elevated mt-10 space-y-6">
      <h1 className="text-2xl font-bold headline text-headline text-center mb-2">Advanced Token Customization</h1>
      <div className="text-tagline text-center mb-4">
        Customize your project's token with features inspired by Zora V4 modular standards. Each field has helpful guides!
      </div>
      <div className="mb-6">
        {step === 1 &&
          <TokenNaming
            name={tokenName}
            symbol={tokenSymbol}
            onChangeName={setTokenName}
            onChangeSymbol={setTokenSymbol}
            onNext={() => setStep(2)}
          />
        }
        {step === 2 &&
          <TokenTypeSelector
            tokenType={tokenType}
            onChange={setTokenType}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        }
        {step === 3 &&
          <SupplySchedule
            supply={totalSupply}
            onChangeSupply={setTotalSupply}
            mintingType={mintingType}
            onChangeMintingType={setMintingType}
            inflationRate={inflationRate}
            deflationRate={deflationRate}
            onChangeInflationRate={setInflationRate}
            onChangeDeflationRate={setDeflationRate}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
            tokenType={tokenType}
          />
        }
        {step === 4 &&
          <DistributionVesting
            distribution={distribution}
            onChange={setDistribution}
            vesting={vesting}
            onChangeVesting={setVesting}
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        }
        {step === 5 &&
          <TokenUtility
            utility={utility}
            onChange={setUtility}
            onNext={() => setStep(6)}
            onBack={() => setStep(4)}
          />
        }
        {step === 6 &&
          <TokenPreview
            name={tokenName}
            symbol={tokenSymbol}
            tokenType={tokenType}
            supply={totalSupply}
            mintingType={mintingType}
            inflationRate={inflationRate}
            deflationRate={deflationRate}
            distribution={distribution}
            vesting={vesting}
            utility={utility}
            onBack={() => setStep(5)}
          />
        }
      </div>
      {!showNav && null}
    </div>
  );
};

export default AdvancedTokenCustomization;
