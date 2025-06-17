
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Lock, Eye, EyeOff, Copy, CheckCircle, AlertTriangle, Wallet } from 'lucide-react';

interface WalletEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletEducationModal({ isOpen, onClose }: WalletEducationModalProps) {
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const securityBestPractices = [
    {
      id: 'seed-phrase',
      title: 'Secure Your Seed Phrase',
      description: 'Never share your 12-24 word recovery phrase. Write it down and store it safely offline.',
      icon: Lock,
      critical: true
    },
    {
      id: 'hardware-wallet',
      title: 'Consider Hardware Wallets',
      description: 'For large amounts, use hardware wallets like Ledger or Trezor for maximum security.',
      icon: Shield,
      critical: false
    },
    {
      id: 'verify-addresses',
      title: 'Always Verify Addresses',
      description: 'Double-check wallet addresses before sending transactions. Crypto transactions are irreversible.',
      icon: Eye,
      critical: true
    },
    {
      id: 'phishing-protection',
      title: 'Beware of Phishing',
      description: 'Only connect your wallet to trusted sites. Check URLs carefully and bookmark official sites.',
      icon: AlertTriangle,
      critical: true
    }
  ];

  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-light tracking-tighter text-text">
            <Wallet className="w-5 h-5" />
            Wallet Security & Best Practices
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="security" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="security" className="font-inter font-light">Security</TabsTrigger>
            <TabsTrigger value="setup" className="font-inter font-light">Setup Guide</TabsTrigger>
            <TabsTrigger value="troubleshooting" className="font-inter font-light">Troubleshooting</TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-light tracking-tighter text-text mb-2">
                Essential Security Practices
              </h3>
              <p className="text-sm text-text/70 font-light tracking-wide">
                Follow these practices to keep your crypto assets safe
              </p>
            </div>

            <div className="grid gap-4">
              {securityBestPractices.map((practice) => {
                const Icon = practice.icon;
                const isCompleted = completedSteps.includes(practice.id);
                
                return (
                  <Card 
                    key={practice.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      isCompleted ? 'border-green-500/50 bg-green-500/5' : 'border-border'
                    } ${practice.critical ? 'border-l-4 border-l-red-500' : ''}`}
                    onClick={() => toggleStepCompletion(practice.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-500/20' : 'bg-surface'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Icon className="w-5 h-5 text-text/70" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-text font-inter font-light tracking-tighter">
                              {practice.title}
                            </h4>
                            {practice.critical && (
                              <Badge variant="destructive" className="text-xs font-light">
                                Critical
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-text/70 font-light tracking-wide">
                            {practice.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="setup" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-light tracking-tighter text-text">
                Setting Up Your First Wallet
              </h3>
              
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base font-light tracking-tighter text-text">
                    Recommended Wallets for Beginners
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-text font-inter font-light">MetaMask</div>
                      <div className="text-xs text-text/70 font-light">Most popular browser extension wallet</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-text font-inter font-light">Coinbase Wallet</div>
                      <div className="text-xs text-text/70 font-light">User-friendly with built-in security features</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base font-light tracking-tighter text-text">
                    Example Seed Phrase Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-surface/50 p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text font-inter font-light">
                        12-Word Recovery Phrase
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                        className="h-6 text-xs font-light"
                      >
                        {showSeedPhrase ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                      {showSeedPhrase ? (
                        ['example', 'seed', 'phrase', 'never', 'share', 'these', 'words', 'with', 'anyone', 'keep', 'them', 'safe'].map((word, index) => (
                          <span key={index} className="bg-background p-1 rounded text-center">
                            {index + 1}. {word}
                          </span>
                        ))
                      ) : (
                        Array.from({ length: 12 }, (_, index) => (
                          <span key={index} className="bg-background p-1 rounded text-center">
                            {index + 1}. ••••••
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-text/70 font-light tracking-wide">
                    ⚠️ This is just an example. Never enter your real seed phrase online!
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-light tracking-tighter text-text">
                Common Issues & Solutions
              </h3>
              
              <div className="space-y-3">
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-text mb-2 font-inter font-light tracking-tighter">
                      Wallet Won't Connect
                    </h4>
                    <ul className="text-sm text-text/70 space-y-1 font-light tracking-wide">
                      <li>• Refresh the page and try again</li>
                      <li>• Check if your wallet extension is unlocked</li>
                      <li>• Make sure you're on the correct network (Base Sepolia)</li>
                      <li>• Disable other wallet extensions temporarily</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-text mb-2 font-inter font-light tracking-tighter">
                      Transaction Failed
                    </h4>
                    <ul className="text-sm text-text/70 space-y-1 font-light tracking-wide">
                      <li>• Check if you have enough ETH for gas fees</li>
                      <li>• Increase slippage tolerance for volatile tokens</li>
                      <li>• Wait for network congestion to clear</li>
                      <li>• Try reducing the transaction amount</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t border-border">
          <Badge variant="outline" className="text-xs font-light">
            {completedSteps.length} / {securityBestPractices.length} security steps completed
          </Badge>
          <Button onClick={onClose} className="bg-accent text-black hover:bg-accent/90 font-light tracking-wide">
            Got It!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
