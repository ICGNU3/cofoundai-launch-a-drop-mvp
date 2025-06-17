
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SlippageSettingsProps {
  slippage: number;
  onSlippageChange: (value: number) => void;
}

export function SlippageSettings({ slippage, onSlippageChange }: SlippageSettingsProps) {
  const presetValues = [0.1, 0.5, 1.0];

  return (
    <div className="flex items-center justify-between text-sm font-inter">
      <span className="text-text/70 font-light tracking-wide">Slippage Tolerance</span>
      <div className="flex gap-1">
        {presetValues.map((value) => (
          <Button
            key={value}
            variant={slippage === value ? "default" : "outline"}
            size="sm"
            onClick={() => onSlippageChange(value)}
            className="h-6 px-2 text-xs font-light font-inter"
          >
            {value}%
          </Button>
        ))}
        <Input
          type="number"
          value={slippage}
          onChange={(e) => onSlippageChange(parseFloat(e.target.value) || 0.5)}
          className="w-16 h-6 px-1 text-xs font-inter font-light"
          step="0.1"
          min="0.1"
          max="50"
        />
      </div>
    </div>
  );
}
