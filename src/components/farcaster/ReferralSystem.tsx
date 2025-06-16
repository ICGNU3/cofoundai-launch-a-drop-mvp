
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/hooks/usePoolStats';
import { Copy, Users, Gift, Trophy, Share, Zap } from 'lucide-react';

interface ReferralSystemProps {
  tokenAddress: string;
  tokenSymbol: string;
  frameData?: {
    castHash?: string;
    fid?: string;
    messageBytes?: string;
  };
}

interface ReferralStats {
  totalReferrals: number;
  totalRewards: number;
  level: number;
  nextLevelThreshold: number;
  referralCode: string;
}

export function ReferralSystem({ tokenAddress, tokenSymbol, frameData }: ReferralSystemProps) {
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 12,
    totalRewards: 45.67,
    level: 2,
    nextLevelThreshold: 25,
    referralCode: 'NEPLUS-ABC123'
  });
  const [customCode, setCustomCode] = useState('');

  const generateReferralLink = () => {
    const baseUrl = window.location.origin;
    const code = customCode || referralStats.referralCode;
    return `${baseUrl}/trade/${tokenAddress}?ref=${code}`;
  };

  const generateReferralFrame = () => {
    const baseUrl = window.location.origin;
    const code = customCode || referralStats.referralCode;
    return `${baseUrl}/frame/${tokenAddress}?ref=${code}`;
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(generateReferralLink());
    // Show toast in real app
  };

  const shareReferralFrame = () => {
    const frameUrl = encodeURIComponent(generateReferralFrame());
    const text = encodeURIComponent(
      `🚀 Join me in trading ${tokenSymbol} on NEPLUS!\n\n` +
      `Use my referral link and we both earn rewards! 💰\n\n` +
      `#NEPLUS #DeFi #${tokenSymbol}`
    );
    
    const farcasterUrl = `https://warpcast.com/~/compose?text=${text}&embeds[]=${frameUrl}`;
    window.open(farcasterUrl, '_blank');
  };

  const levelProgress = (referralStats.totalReferrals / referralStats.nextLevelThreshold) * 100;

  const rewardTiers = [
    { level: 1, threshold: 5, reward: '1%', emoji: '🥉' },
    { level: 2, threshold: 15, reward: '2%', emoji: '🥈' },
    { level: 3, threshold: 25, reward: '3%', emoji: '🥇' },
    { level: 4, threshold: 50, reward: '5%', emoji: '💎' },
    { level: 5, threshold: 100, reward: '10%', emoji: '👑' }
  ];

  return (
    <div className="space-y-4">
      {/* Current Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5 text-accent" />
            Referral Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-surface rounded-lg">
              <div className="text-2xl font-bold text-accent">{referralStats.totalReferrals}</div>
              <div className="text-sm text-text/70">Total Referrals</div>
            </div>
            <div className="text-center p-3 bg-surface rounded-lg">
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(referralStats.totalRewards.toString())}
              </div>
              <div className="text-sm text-text/70">Rewards Earned</div>
            </div>
          </div>

          {/* Level Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {rewardTiers[referralStats.level - 1]?.emoji} Level {referralStats.level}
                </Badge>
                <span className="text-sm text-text/70">
                  {rewardTiers[referralStats.level - 1]?.reward} commission
                </span>
              </div>
              <span className="text-xs text-text/70">
                {referralStats.totalReferrals}/{referralStats.nextLevelThreshold}
              </span>
            </div>
            <Progress value={levelProgress} className="h-2" />
            <div className="text-xs text-text/70 mt-1">
              {referralStats.nextLevelThreshold - referralStats.totalReferrals} more referrals to next level
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Tiers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Reward Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rewardTiers.map((tier) => (
              <div
                key={tier.level}
                className={`flex items-center justify-between p-2 rounded ${
                  tier.level === referralStats.level
                    ? 'bg-accent/10 border border-accent/20'
                    : tier.level < referralStats.level
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-surface/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tier.emoji}</span>
                  <span className="font-medium">Level {tier.level}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{tier.reward}</div>
                  <div className="text-xs text-text/70">{tier.threshold} referrals</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral Link */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Share className="w-5 h-5" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Custom Code (Optional)</label>
            <Input
              placeholder="Enter custom referral code..."
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
              className="bg-card border-border"
            />
          </div>

          <div className="text-xs text-text/50 bg-surface/50 p-2 rounded break-all">
            {generateReferralLink()}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={copyReferralLink}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button onClick={shareReferralFrame} className="bg-purple-600 hover:bg-purple-700">
              <Zap className="w-4 h-4 mr-2" />
              Share Frame
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Viral Boost */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-accent">Viral Boost Active!</div>
              <div className="text-sm text-text/70">
                Double rewards for the next 24 hours
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            Recent Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { user: 'user1.eth', reward: '0.15', time: '2h ago' },
              { user: 'trader.eth', reward: '0.32', time: '5h ago' },
              { user: 'defi.eth', reward: '0.08', time: '1d ago' }
            ].map((referral, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-surface/50 rounded">
                <div>
                  <div className="font-medium text-sm">{referral.user}</div>
                  <div className="text-xs text-text/70">{referral.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-500">
                    +{formatCurrency(referral.reward)}
                  </div>
                  <div className="text-xs text-text/70">reward</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
