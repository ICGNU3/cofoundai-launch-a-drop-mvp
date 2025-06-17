
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Clock, AlertTriangle } from 'lucide-react';

interface LimitOrderFormProps {
  tokenSymbol: string;
  currentPrice: number;
  onPlaceOrder: (order: LimitOrder) => void;
}

export interface LimitOrder {
  type: 'limit' | 'stop-loss';
  direction: 'buy' | 'sell';
  amount: string;
  triggerPrice: string;
  expiresAt?: Date;
}

export function LimitOrderForm({ tokenSymbol, currentPrice, onPlaceOrder }: LimitOrderFormProps) {
  const [orderType, setOrderType] = useState<'limit' | 'stop-loss'>('limit');
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [expiresIn, setExpiresIn] = useState('24'); // hours

  const handleSubmit = () => {
    if (!amount || !triggerPrice) return;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn));

    const order: LimitOrder = {
      type: orderType,
      direction,
      amount,
      triggerPrice,
      expiresAt
    };

    onPlaceOrder(order);
    
    // Reset form
    setAmount('');
    setTriggerPrice('');
  };

  const priceDirection = parseFloat(triggerPrice) > currentPrice ? 'above' : 'below';
  const pricePercentage = Math.abs(((parseFloat(triggerPrice) - currentPrice) / currentPrice) * 100);

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 font-inter font-light">
          <Clock className="w-5 h-5" />
          Advanced Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Type Selection */}
        <div className="flex gap-2">
          <Button
            variant={orderType === 'limit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setOrderType('limit')}
            className="flex-1 font-inter font-light"
          >
            Limit Order
          </Button>
          <Button
            variant={orderType === 'stop-loss' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setOrderType('stop-loss')}
            className="flex-1 font-inter font-light"
          >
            Stop Loss
          </Button>
        </div>

        {/* Direction Selection */}
        <div className="flex gap-2">
          <Button
            variant={direction === 'buy' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDirection('buy')}
            className="flex-1 font-inter font-light text-green-600"
          >
            Buy
          </Button>
          <Button
            variant={direction === 'sell' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDirection('sell')}
            className="flex-1 font-inter font-light text-red-600"
          >
            Sell
          </Button>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm text-text/70 font-inter font-light">Amount ({tokenSymbol})</label>
          <Input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-card border-border text-text font-inter"
          />
        </div>

        {/* Trigger Price Input */}
        <div className="space-y-2">
          <label className="text-sm text-text/70 font-inter font-light">
            {orderType === 'limit' ? 'Limit Price' : 'Stop Price'} (USD)
          </label>
          <Input
            type="number"
            placeholder={currentPrice.toFixed(4)}
            value={triggerPrice}
            onChange={(e) => setTriggerPrice(e.target.value)}
            className="bg-card border-border text-text font-inter"
          />
          {triggerPrice && (
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className={priceDirection === 'above' ? 'text-green-600' : 'text-red-600'}>
                {pricePercentage.toFixed(1)}% {priceDirection} current price
              </Badge>
            </div>
          )}
        </div>

        {/* Expiration */}
        <div className="space-y-2">
          <label className="text-sm text-text/70 font-inter font-light">Expires in (hours)</label>
          <select
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-border rounded text-text font-inter"
          >
            <option value="1">1 hour</option>
            <option value="6">6 hours</option>
            <option value="24">24 hours</option>
            <option value="168">1 week</option>
            <option value="720">1 month</option>
          </select>
        </div>

        {/* Order Summary */}
        {amount && triggerPrice && (
          <div className="bg-surface/50 p-3 rounded text-sm space-y-1 font-inter">
            <div className="flex justify-between">
              <span className="text-text/70">Order Type:</span>
              <span className="font-light">{orderType === 'limit' ? 'Limit' : 'Stop Loss'} {direction}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Amount:</span>
              <span className="font-light">{amount} {tokenSymbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Trigger Price:</span>
              <span className="font-light">${triggerPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Est. Total:</span>
              <span className="font-light">${(parseFloat(amount) * parseFloat(triggerPrice)).toFixed(2)}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!amount || !triggerPrice}
          className="w-full bg-accent text-black hover:bg-accent/90 font-inter font-light"
        >
          Place {orderType === 'limit' ? 'Limit' : 'Stop Loss'} Order
        </Button>

        {orderType === 'stop-loss' && (
          <div className="flex items-start gap-2 text-xs text-orange-600 bg-orange-500/10 p-2 rounded">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="font-inter font-light">
              Stop loss orders are not guaranteed to execute at the exact price due to market volatility.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
