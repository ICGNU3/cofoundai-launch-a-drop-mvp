
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

interface SwapFormProps {
  amountIn: string;
  amountOut: string;
  tokenIn: string;
  isReversed: boolean;
  tokenSymbol: string;
  onAmountInChange: (value: string) => void;
  onTokenInChange: (value: string) => void;
  onReverse: () => void;
}

export function SwapForm({
  amountIn,
  amountOut,
  tokenIn,
  isReversed,
  tokenSymbol,
  onAmountInChange,
  onTokenInChange,
  onReverse
}: SwapFormProps) {
  const currentSymbolIn = isReversed ? tokenSymbol : tokenIn;
  const currentSymbolOut = isReversed ? tokenIn : tokenSymbol;

  return (
    <>
      {/* Token Input */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-text/70 font-inter">
          <span className="font-light tracking-wide">From</span>
          <span className="font-light tracking-wide">Balance: 0.0</span>
        </div>
        <div className="flex gap-2">
          <select 
            value={currentSymbolIn} 
            onChange={(e) => {
              if (isReversed) {
                return;
              }
              onTokenInChange(e.target.value);
            }}
            disabled={isReversed}
            className="px-3 py-2 bg-card border border-border rounded text-text min-w-[80px] font-inter font-light"
          >
            <option value="ETH">ETH</option>
            <option value="USDC">USDC</option>
            {isReversed && <option value={tokenSymbol}>{tokenSymbol}</option>}
          </select>
          <Input
            type="number"
            placeholder="0.0"
            value={amountIn}
            onChange={(e) => onAmountInChange(e.target.value)}
            className="flex-1 bg-card border-border text-text font-inter font-light"
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onReverse}
          className="rounded-full p-2 font-inter font-light"
        >
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Token Output */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-text/70 font-inter">
          <span className="font-light tracking-wide">To</span>
          <span className="font-light tracking-wide">Balance: 0.0</span>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-2 bg-card border border-border rounded text-text min-w-[80px] flex items-center font-inter font-light">
            {currentSymbolOut}
          </div>
          <Input
            type="number"
            placeholder="0.0"
            value={amountOut}
            readOnly
            className="flex-1 bg-card border-border text-text font-inter font-light"
          />
        </div>
      </div>
    </>
  );
}
