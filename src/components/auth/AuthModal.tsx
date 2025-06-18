
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Wallet, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, isLoading } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    console.log('AuthModal: Attempting login...');
    setIsConnecting(true);
    
    try {
      await login();
      console.log('AuthModal: Login successful, closing modal');
      onClose();
    } catch (error) {
      console.error('AuthModal: Login error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to connect with Privy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
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
              disabled={isLoading || isConnecting}
              className="w-full bg-accent text-black hover:bg-accent/90 h-12"
            >
              {(isLoading || isConnecting) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect with Privy
                </>
              )}
            </Button>
            
            {/* Debug info */}
            <div className="text-xs text-center text-text/50 space-y-1">
              <div>Debug: Privy App ID configured</div>
              <div>Status: {isLoading ? 'Loading...' : 'Ready'}</div>
            </div>
          </div>

          <div className="text-xs text-center text-text/50">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
