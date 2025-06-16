
import React from "react";
import { useLiquidityPoolCreation } from "./liquidityDEX/useLiquidityPoolCreation";
import { PoolCreationStep1 } from "./liquidityDEX/PoolCreationStep1";
import { PoolCreationStep2 } from "./liquidityDEX/PoolCreationStep2";
import { PoolCreatedStep3 } from "./liquidityDEX/PoolCreatedStep3";
import { defaultPairedToken } from "./liquidityDEX/dexConstants";

type Props = {
  tokenSymbol: string;
  tokenAddress: string;
  pairedToken?: { symbol: string; address: string };
  dexNetwork: "ethereum" | "polygon" | "base";
  poolAddress?: string;
  onPoolCreated?: (poolAddress: string) => void;
};

const LiquidityDEXIntegration: React.FC<Props> = ({
  tokenSymbol,
  tokenAddress,
  pairedToken = defaultPairedToken,
  dexNetwork,
  poolAddress,
  onPoolCreated,
}) => {
  const {
    step,
    setStep,
    liquidityAmount,
    setLiquidityAmount,
    isCreatingPool,
    handleCreatePool,
    isLoading,
    error,
    txHash
  } = useLiquidityPoolCreation({
    tokenSymbol,
    tokenAddress,
    pairedToken,
    poolAddress,
    onPoolCreated,
  });

  if (step === 1) {
    return (
      <PoolCreationStep1
        tokenSymbol={tokenSymbol}
        liquidityAmount={liquidityAmount}
        setLiquidityAmount={setLiquidityAmount}
        onNext={() => setStep(2)}
      />
    );
  }

  if (step === 2) {
    return (
      <PoolCreationStep2
        tokenSymbol={tokenSymbol}
        liquidityAmount={liquidityAmount}
        isLoading={isLoading}
        isCreatingPool={isCreatingPool}
        error={error}
        txHash={txHash}
        onCreatePool={handleCreatePool}
        onBack={() => setStep(1)}
      />
    );
  }

  return (
    <PoolCreatedStep3
      tokenSymbol={tokenSymbol}
      tokenAddress={tokenAddress}
      pairedToken={pairedToken}
      dexNetwork={dexNetwork}
      poolAddress={poolAddress}
      liquidityAmount={liquidityAmount}
    />
  );
};

export default LiquidityDEXIntegration;
