
import React from "react";

interface StatusCardsSectionProps {
  tokenAddress: string | null;
  txHash: string | null;
  escrowFundedAmount: number | null;
  expenseSum: number | null;
  streamsActive: boolean | null;
  rolesCount: number;
  activeStreamsCount: number;
  totalFlowRate: number;
}

export const StatusCardsSection: React.FC<StatusCardsSectionProps> = ({
  tokenAddress,
  txHash,
  escrowFundedAmount,
  expenseSum,
  streamsActive,
  rolesCount,
  activeStreamsCount,
  totalFlowRate,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    {/* Token Minted Status */}
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold text-body-text mb-3">Token Status</h3>
      {tokenAddress ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-green-400 font-medium">Minted</span>
          </div>
          <div className="text-sm text-body-text/70 break-all">
            Token: {tokenAddress}
          </div>
          {txHash && (
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent text-sm hover:underline block"
            >
              View Transaction
            </a>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span className="text-yellow-400 font-medium">Pending</span>
        </div>
      )}
    </div>

    {/* Escrow Status */}
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold text-body-text mb-3">Escrow Status</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            (escrowFundedAmount || 0) >= (expenseSum || 0)
              ? 'bg-green-400' 
              : 'bg-yellow-400'
          }`}></div>
          <span className={`font-medium ${
            (escrowFundedAmount || 0) >= (expenseSum || 0)
              ? 'text-green-400' 
              : 'text-yellow-400'
          }`}>
            {(escrowFundedAmount || 0) >= (expenseSum || 0) ? 'Funded' : 'Partial'}
          </span>
        </div>
        <div className="text-sm text-body-text/70">
          ${(escrowFundedAmount || 0).toFixed(2)} / ${(expenseSum || 0).toFixed(2)} USDC
        </div>
      </div>
    </div>

    {/* Streams Status */}
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold text-body-text mb-3">Streams Status</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            streamsActive ? 'bg-green-400' : 'bg-red-400'
          }`}></div>
          <span className={`font-medium ${
            streamsActive ? 'text-green-400' : 'text-red-400'
          }`}>
            {streamsActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="text-sm text-body-text/70">
          {activeStreamsCount} of {rolesCount} streams running
        </div>
        {totalFlowRate > 0 && (
          <div className="text-sm text-body-text/70">
            Flow rate: {totalFlowRate.toFixed(6)} USDC/sec
          </div>
        )}
      </div>
    </div>
  </div>
);
