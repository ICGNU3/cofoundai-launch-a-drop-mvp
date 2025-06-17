
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/hooks/usePoolStats';

interface PricePoint {
  timestamp: string;
  price: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  rsi?: number;
  support?: number;
  resistance?: number;
}

interface AdvancedChartProps {
  tokenSymbol: string;
  currentPrice: number;
  priceChange24h: number;
  data: PricePoint[];
}

interface TechnicalIndicator {
  name: string;
  key: keyof PricePoint;
  color: string;
  visible: boolean;
}

// Calculate Simple Moving Average
const calculateSMA = (data: PricePoint[], period: number, key: 'sma20' | 'sma50') => {
  return data.map((point, index) => {
    if (index < period - 1) return { ...point, [key]: undefined };
    
    const sum = data.slice(index - period + 1, index + 1)
      .reduce((acc, p) => acc + p.price, 0);
    
    return { ...point, [key]: sum / period };
  });
};

// Calculate RSI
const calculateRSI = (data: PricePoint[], period: number = 14) => {
  return data.map((point, index) => {
    if (index < period) return { ...point, rsi: 50 };
    
    const changes = data.slice(index - period, index)
      .map((p, i, arr) => i > 0 ? p.price - arr[i - 1].price : 0);
    
    const gains = changes.filter(c => c > 0).reduce((sum, c) => sum + c, 0) / period;
    const losses = Math.abs(changes.filter(c => c < 0).reduce((sum, c) => sum + c, 0)) / period;
    
    const rs = losses === 0 ? 100 : gains / losses;
    const rsi = 100 - (100 / (1 + rs));
    
    return { ...point, rsi };
  });
};

// Add support and resistance levels
const addSupportResistance = (data: PricePoint[]) => {
  const prices = data.map(d => d.price);
  const support = Math.min(...prices) * 1.02; // 2% above lowest
  const resistance = Math.max(...prices) * 0.98; // 2% below highest
  
  return data.map(point => ({ ...point, support, resistance }));
};

export function AdvancedChart({ tokenSymbol, currentPrice, priceChange24h, data }: AdvancedChartProps) {
  const [timeframe, setTimeframe] = useState<'1H' | '4H' | '1D' | '1W'>('1D');
  const [showVolume, setShowVolume] = useState(false);
  
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([
    { name: 'SMA 20', key: 'sma20', color: '#3B82F6', visible: false },
    { name: 'SMA 50', key: 'sma50', color: '#F59E0B', visible: false },
    { name: 'Support/Resistance', key: 'support', color: '#10B981', visible: false }
  ]);

  // Process data with technical indicators
  let processedData = [...data];
  processedData = calculateSMA(processedData, 20, 'sma20');
  processedData = calculateSMA(processedData, 50, 'sma50');
  processedData = calculateRSI(processedData);
  processedData = addSupportResistance(processedData);

  const toggleIndicator = (index: number) => {
    setIndicators(prev => prev.map((ind, i) => 
      i === index ? { ...ind, visible: !ind.visible } : ind
    ));
  };

  const isPositive = priceChange24h >= 0;
  const latestData = processedData[processedData.length - 1];

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5" />
            <span className="font-inter font-light">{tokenSymbol} Advanced Chart</span>
            <Badge variant="outline" className="text-xs font-inter font-light">
              {timeframe}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-inter">{formatCurrency(currentPrice.toString())}</div>
            <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositive ? '+' : ''}{formatPercentage(priceChange24h.toString())}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Timeframe Selection */}
        <div className="flex gap-2">
          {(['1H', '4H', '1D', '1W'] as const).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="font-inter font-light"
            >
              {tf}
            </Button>
          ))}
        </div>

        {/* Technical Indicators */}
        <div className="flex flex-wrap gap-2">
          {indicators.map((indicator, index) => (
            <Button
              key={indicator.name}
              variant={indicator.visible ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleIndicator(index)}
              className="font-inter font-light text-xs"
              style={{ 
                backgroundColor: indicator.visible ? indicator.color : undefined,
                borderColor: indicator.color 
              }}
            >
              {indicator.name}
            </Button>
          ))}
          <Button
            variant={showVolume ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowVolume(!showVolume)}
            className="font-inter font-light text-xs"
          >
            Volume
          </Button>
        </div>

        {/* Technical Analysis Summary */}
        {latestData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-inter">
            <div className="bg-surface/50 p-3 rounded">
              <div className="text-text/70 font-light">RSI (14)</div>
              <div className={`font-light ${
                latestData.rsi! > 70 ? 'text-red-500' : 
                latestData.rsi! < 30 ? 'text-green-500' : 'text-text'
              }`}>
                {latestData.rsi?.toFixed(1)}
              </div>
            </div>
            <div className="bg-surface/50 p-3 rounded">
              <div className="text-text/70 font-light">Support</div>
              <div className="font-light">${latestData.support?.toFixed(4)}</div>
            </div>
            <div className="bg-surface/50 p-3 rounded">
              <div className="text-text/70 font-light">Resistance</div>
              <div className="font-light">${latestData.resistance?.toFixed(4)}</div>
            </div>
            <div className="bg-surface/50 p-3 rounded">
              <div className="text-text/70 font-light">Trend</div>
              <div className={`font-light flex items-center gap-1 ${
                latestData.sma20! > latestData.sma50! ? 'text-green-500' : 'text-red-500'
              }`}>
                {latestData.sma20! > latestData.sma50! ? (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    Bullish
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3" />
                    Bearish
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Chart */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `$${value.toFixed(3)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                  fontFamily: 'Inter',
                  fontWeight: 300
                }}
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number, name: string) => [
                  name === 'price' ? formatCurrency(value.toString()) : value.toFixed(2),
                  name === 'price' ? 'Price' : name.toUpperCase()
                ]}
              />
              
              {/* Main price line */}
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10B981" : "#EF4444"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: isPositive ? "#10B981" : "#EF4444" }}
              />

              {/* Technical indicators */}
              {indicators.map((indicator) => (
                indicator.visible && indicator.key !== 'support' && (
                  <Line
                    key={indicator.key}
                    type="monotone"
                    dataKey={indicator.key}
                    stroke={indicator.color}
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                )
              ))}

              {/* Support and Resistance lines */}
              {indicators.find(i => i.key === 'support')?.visible && latestData && (
                <>
                  <ReferenceLine y={latestData.support} stroke="#10B981" strokeDasharray="3 3" />
                  <ReferenceLine y={latestData.resistance} stroke="#EF4444" strokeDasharray="3 3" />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Chart */}
        {showVolume && (
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit' })}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#6B7280"
                  strokeWidth={1}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
