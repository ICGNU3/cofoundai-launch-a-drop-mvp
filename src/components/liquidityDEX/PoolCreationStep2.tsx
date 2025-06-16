
import React from "react";

type Props = {
  tokenSymbol: string;
  liquidityAmount: string;
  isLoading: boolean;
  isCreatingPool: boolean;
  error: string | null;
  txHash: string | null;
  onCreatePool: () => void;
  onBack: () => void;
};

export function PoolCreationStep2({
  tokenSymbol,
  liquidityAmount,
  isLoading,
  isCreatingPool,
  error,
  txHash,
  onCreatePool,
  onBack
}: Props) {
  return (
    <section className="bg-card border border-border rounded-lg p-6">
      <h2 className="font-bold text-xl mb-4">Create Pool: {tokenSymbol}/USDC</h2>
      
      <div className="space-y-4 mb-6">
        <div className="bg-surface border border-border rounded p-4">
          <h3 className="font-semibold mb-2">Pool Configuration</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Token Pair:</span>
              <span>{tokenSymbol}/USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Fee Tier:</span>
              <span>0.3%</span>
            </div>
            <div className="flex justify-between">
              <span>Initial Liquidity:</span>
              <span>{liquidityAmount} USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Initial Price:</span>
              <span>1 {tokenSymbol} = 1 USDC</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="flex-1 bg-accent text-white py-3 px-4 rounded-md font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onCreatePool}
          disabled={isLoading || isCreatingPool}
        >
          {isLoading || isCreatingPool ? 'Creating Pool...' : 'Create Pool'}
        </button>
        <button
          className="px-4 py-3 border border-border rounded-md hover:bg-surface"
          onClick={onBack}
          disabled={isLoading || isCreatingPool}
        >
          Back
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          Error: {error}
        </div>
      )}

      {txHash && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
          Transaction submitted: {txHash.slice(0, 10)}...{txHash.slice(-8)}
        </div>
      )}
    </section>
  );
}
