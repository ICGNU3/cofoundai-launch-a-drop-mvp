
import React, { useState, useEffect } from "react";

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

interface AdvancedTokenCustomizationControllerProps {
  initialState?: any;
  onStateChange?: (state: any) => void;
  children: (props: {
    state: TokenCustomizationState;
    updateState: <K extends keyof TokenCustomizationState>(
      key: K,
      value: TokenCustomizationState[K]
    ) => void;
    canProceed: () => boolean;
  }) => React.ReactNode;
}

export const AdvancedTokenCustomizationController: React.FC<AdvancedTokenCustomizationControllerProps> = ({
  initialState,
  onStateChange,
  children,
}) => {
  const [state, setState] = useState<TokenCustomizationState>({
    name: initialState?.name || "",
    symbol: initialState?.symbol || "",
    tokenType: initialState?.tokenType || "erc20",
    totalSupply: initialState?.totalSupply || 1000000,
    mintingType: initialState?.mintingType || "fixed",
    inflationRate: initialState?.inflationRate || 0,
    deflationRate: initialState?.deflationRate || 0,
    distribution: initialState?.distribution || {
      team: 20,
      treasury: 30,
      publicSale: 50,
    },
    vesting: initialState?.vesting || {
      team: 12,
      early: 6,
    },
    utility: initialState?.utility || {
      governance: true,
      access: false,
      staking: false,
      custom: "",
    },
  });

  const updateState = <K extends keyof TokenCustomizationState>(
    key: K,
    value: TokenCustomizationState[K]
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    return !!state.name && !!state.symbol && state.totalSupply > 0 &&
      Object.values(state.distribution).reduce((a, b) => a + b, 0) === 100;
  };

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  return <>{children({ state, updateState, canProceed })}</>;
};
