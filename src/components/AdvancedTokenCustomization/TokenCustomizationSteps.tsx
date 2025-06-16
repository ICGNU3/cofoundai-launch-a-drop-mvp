
import React from "react";
import { TokenNaming } from "./TokenNaming";
import { SupplySchedule } from "./SupplySchedule";
import { TokenTypeSelector } from "./TokenTypeSelector";
import { DistributionVesting } from "./DistributionVesting";
import { TokenUtility } from "./TokenUtility";
import { TokenPreview } from "./TokenPreview";

interface TokenCustomizationState {
  name: string;
  symbol: string;
  tokenType: "erc20" | "erc721";
  totalSupply: number;
  mintingType: "fixed" | "inflation" | "deflation";
  inflationRate: number;
  deflationRate: number;
  distribution: {
    team: number;
    treasury: number;
    publicSale: number;
  };
  vesting: {
    team: number;
    early: number;
  };
  utility: {
    governance: boolean;
    access: boolean;
    staking: boolean;
    custom: string;
  };
}

interface TokenCustomizationStepsProps {
  step: number;
  state: TokenCustomizationState;
  updateState: <K extends keyof TokenCustomizationState>(
    key: K,
    value: TokenCustomizationState[K]
  ) => void;
  onStepChange: (step: number) => void;
}

export const TokenCustomizationSteps: React.FC<TokenCustomizationStepsProps> = ({
  step,
  state,
  updateState,
  onStepChange,
}) => {
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <TokenNaming
            name={state.name}
            symbol={state.symbol}
            onChangeName={(name) => updateState('name', name)}
            onChangeSymbol={(symbol) => updateState('symbol', symbol)}
            onNext={() => onStepChange(2)}
          />
        );
      case 2:
        return (
          <TokenTypeSelector
            tokenType={state.tokenType}
            onChange={(tokenType) => updateState('tokenType', tokenType)}
            onNext={() => onStepChange(3)}
            onBack={() => onStepChange(1)}
          />
        );
      case 3:
        return (
          <SupplySchedule
            supply={state.totalSupply}
            onChangeSupply={(totalSupply) => updateState('totalSupply', totalSupply)}
            mintingType={state.mintingType}
            onChangeMintingType={(mintingType) => updateState('mintingType', mintingType)}
            inflationRate={state.inflationRate}
            deflationRate={state.deflationRate}
            onChangeInflationRate={(inflationRate) => updateState('inflationRate', inflationRate)}
            onChangeDeflationRate={(deflationRate) => updateState('deflationRate', deflationRate)}
            onNext={() => onStepChange(4)}
            onBack={() => onStepChange(2)}
            tokenType={state.tokenType}
          />
        );
      case 4:
        return (
          <DistributionVesting
            distribution={state.distribution}
            onChange={(distribution) => updateState('distribution', distribution)}
            vesting={state.vesting}
            onChangeVesting={(vesting) => updateState('vesting', vesting)}
            onNext={() => onStepChange(5)}
            onBack={() => onStepChange(3)}
          />
        );
      case 5:
        return (
          <TokenUtility
            utility={state.utility}
            onChange={(utility) => updateState('utility', utility)}
            onNext={() => onStepChange(6)}
            onBack={() => onStepChange(4)}
          />
        );
      case 6:
        return (
          <TokenPreview
            name={state.name}
            symbol={state.symbol}
            tokenType={state.tokenType}
            supply={state.totalSupply}
            mintingType={state.mintingType}
            inflationRate={state.inflationRate}
            deflationRate={state.deflationRate}
            distribution={state.distribution}
            vesting={state.vesting}
            utility={state.utility}
            onBack={() => onStepChange(5)}
          />
        );
      default:
        return null;
    }
  };

  return <div className="mb-6">{renderStep()}</div>;
};
