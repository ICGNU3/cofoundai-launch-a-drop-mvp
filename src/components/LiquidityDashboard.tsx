
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/hooks/usePoolStats';

interface LiquidityPosition {
  id: string;
  coinSymbol: string;
  coinName: string;
  liquidity: string;
  unclaimedRoyalties: string;
  feeAPR: string;
}

interface LiquidityDashboardProps {
  positions: LiquidityPosition[];
  onClaim: (positionId: string) => void;
  isClaimLoading?: boolean;
}

export function LiquidityDashboard({ positions, onClaim, isClaimLoading }: LiquidityDashboardProps) {
  const totalUnclaimedRoyalties = positions.reduce(
    (sum, position) => sum + parseFloat(position.unclaimedRoyalties || '0'),
    0
  );

  return (
    <div className="space-y-6">
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-headline">My Liquidity Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-card rounded-lg border border-border">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-text/70">Total Unclaimed Royalties</div>
                <div className="text-2xl font-bold text-accent">
                  {formatCurrency(totalUnclaimedRoyalties.toString())}
                </div>
              </div>
              <Button 
                onClick={() => onClaim('all')}
                disabled={totalUnclaimedRoyalties === 0 || isClaimLoading}
                className="bg-accent text-black hover:bg-accent/90"
              >
                {isClaimLoading ? 'Claiming...' : 'Claim All'}
              </Button>
            </div>
          </div>

          {positions.length === 0 ? (
            <div className="text-center py-8 text-text/70">
              No liquidity positions found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-text/70">Coin</TableHead>
                  <TableHead className="text-text/70">Liquidity</TableHead>
                  <TableHead className="text-text/70">Unclaimed</TableHead>
                  <TableHead className="text-text/70">APR</TableHead>
                  <TableHead className="text-text/70">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position) => (
                  <TableRow key={position.id} className="border-border hover:bg-card/50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-text">{position.coinSymbol}</div>
                        <div className="text-sm text-text/70">{position.coinName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-text">
                      {formatCurrency(position.liquidity)}
                    </TableCell>
                    <TableCell className="font-mono text-accent">
                      {formatCurrency(position.unclaimedRoyalties)}
                    </TableCell>
                    <TableCell className="font-mono text-text">
                      {parseFloat(position.feeAPR).toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => onClaim(position.id)}
                        disabled={parseFloat(position.unclaimedRoyalties) === 0 || isClaimLoading}
                        className="bg-accent/20 text-accent border border-accent hover:bg-accent/30"
                      >
                        Claim
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
