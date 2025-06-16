
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Wallet, Mail } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, isLoading } = useAuth();
  const [authMethod, setAuthMethod] = useState<'wallet' | 'email'>('wallet');

  const handleLogin = () => {
    login();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Welcome to NEPLUS</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center text-sm text-text/70">
            Connect your wallet or email to get started with decentralized content creation.
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-accent text-black hover:bg-accent/90 h-12"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4 mr-2" />
              )}
              Connect with Privy
            </Button>
          </div>

          <div className="text-xs text-center text-text/50">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
