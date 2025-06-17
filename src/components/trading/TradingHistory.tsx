
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Clock, CheckCircle, XCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency } from '@/hooks/usePoolStats';

interface Trade {
  id: string;
  type: 'market' | 'limit' | 'stop-loss';
  direction: 'buy' | 'sell';
  tokenSymbol: string;
  amount: string;
  price: number;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  timestamp: string;
  txHash?: string;
}

interface OpenOrder {
  id: string;
  type: 'limit' | 'stop-loss';
  direction: 'buy' | 'sell';
  tokenSymbol: string;
  amount: string;
  triggerPrice: number;
  currentPrice: number;
  status: 'active' | 'triggered' | 'expired';
  expiresAt: string;
  createdAt: string;
}

interface TradingHistoryProps {
  trades?: Trade[];
  openOrders?: OpenOrder[];
}

// Mock data
const mockTrades: Trade[] = [
  {
    id: '1',
    type: 'market',
    direction: 'buy',
    tokenSymbol: 'FILMX',
    amount: '100',
    price: 0.45,
    total: 45,
    status: 'completed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    txHash: '0x1234...5678'
  },
  {
    id: '2',
    type: 'limit',
    direction: 'sell',
    tokenSymbol: 'MUSICX',
    amount: '50',
    price: 0.52,
    total: 26,
    status: 'completed',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    txHash: '0x2345...6789'
  },
  {
    id: '3',
    type: 'market',
    direction: 'buy',
    tokenSymbol: 'GAMEX',
    amount: '75',
    price: 0.38,
    total: 28.5,
    status: 'pending',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  }
];

const mockOpenOrders: OpenOrder[] = [
  {
    id: '1',
    type: 'limit',
    direction: 'buy',
    tokenSymbol: 'FILMX',
    amount: '200',
    triggerPrice: 0.40,
    currentPrice: 0.45,
    status: 'active',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    type: 'stop-loss',
    direction: 'sell',
    tokenSymbol: 'MUSICX',
    amount: '100',
    triggerPrice: 0.48,
    currentPrice: 0.52,
    status: 'active',
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];

export function TradingHistory({ trades = mockTrades, openOrders = mockOpenOrders }: TradingHistoryProps) {
  const [selectedTab, setSelectedTab] = useState('history');

  const formatTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const time = new Date(timestamp).getTime();
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-inter font-light">
          <Activity className="w-5 h-5" />
          Trading Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history" className="font-inter font-light">Trade History</TabsTrigger>
            <TabsTrigger value="orders" className="font-inter font-light">Open Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-3 mt-4">
            {trades.length === 0 ? (
              <div className="text-center py-8 text-text/70">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-inter font-light">No trading history yet</p>
              </div>
            ) : (
              trades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      trade.direction === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {trade.direction === 'buy' ? 
                        <ArrowDownLeft className="w-4 h-4" /> : 
                        <ArrowUpRight className="w-4 h-4" />
                      }
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={trade.direction === 'buy' ? 'default' : 'secondary'} className="text-xs font-inter font-light">
                          {trade.type.toUpperCase()} {trade.direction.toUpperCase()}
                        </Badge>
                        <span className="font-semibold font-inter">{trade.tokenSymbol}</span>
                        {getStatusIcon(trade.status)}
                      </div>
                      <div className="text-sm text-text/70 font-inter font-light">
                        {trade.amount} tokens @ ${trade.price.toFixed(4)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold font-inter">{formatCurrency(trade.total.toString())}</div>
                    <div className="text-sm text-text/70 font-inter font-light">{formatTimeAgo(trade.timestamp)}</div>
                    {trade.txHash && (
                      <div className="text-xs text-text/70 font-mono">
                        {trade.txHash.slice(0, 6)}...{trade.txHash.slice(-4)}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-3 mt-4">
            {openOrders.length === 0 ? (
              <div className="text-center py-8 text-text/70">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-inter font-light">No open orders</p>
              </div>
            ) : (
              openOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.direction === 'buy' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      <Clock className="w-4 h-4" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-inter font-light">
                          {order.type.toUpperCase()} {order.direction.toUpperCase()}
                        </Badge>
                        <span className="font-semibold font-inter">{order.tokenSymbol}</span>
                        {getStatusIcon(order.status)}
                      </div>
                      <div className="text-sm text-text/70 font-inter font-light">
                        {order.amount} tokens @ ${order.triggerPrice.toFixed(4)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-inter">
                      Current: ${order.currentPrice.toFixed(4)}
                    </div>
                    <div className="text-sm text-text/70 font-inter font-light">
                      Expires {formatTimeAgo(order.expiresAt)}
                    </div>
                    <Badge 
                      variant={order.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs font-inter font-light"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
