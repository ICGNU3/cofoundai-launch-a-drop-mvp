
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { toast } = useToast();

  // Debug logging function
  const addDebugLog = (message: string) => {
    console.log(`[AuthModal] ${message}`);
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    if (isOpen) {
      addDebugLog('Modal opened');
      setConnectionState('idle');
      setDebugInfo([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      addDebugLog('User authenticated successfully');
      setConnectionState('success');
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [isAuthenticated, isOpen, onClose]);

  const handleLogin = async () => {
    addDebugLog('Login button clicked');
    setIsConnecting(true);
    setConnectionState('connecting');
    
    try {
      addDebugLog('Calling login function...');
      await login();
      addDebugLog('Login function completed');
    } catch (error) {
      console.error('AuthModal: Login error:', error);
      addDebugLog(`Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setConnectionState('error');
      
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "Failed to connect with Privy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const renderConnectionState = () => {
    switch (connectionState) {
      case 'connecting':
        return (
          <div className="text-center text-sm text-blue-400">
            <Loader2 className="w-4 h-4 mx-auto mb-2 animate-spin" />
            Connecting to Privy...
          </div>
        );
      case 'success':
        return (
          <div className="text-center text-sm text-green-400">
            <CheckCircle className="w-4 h-4 mx-auto mb-2" />
            Connected successfully! Redirecting...
          </div>
        );
      case 'error':
        return (
          <div className="text-center text-sm text-red-400">
            <AlertCircle className="w-4 h-4 mx-auto mb-2" />
            Connection failed. Please try again.
          </div>
        );
      default:
        return null;
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
              disabled={isLoading || isConnecting || connectionState === 'success'}
              className="w-full bg-accent text-black hover:bg-accent/90 h-12"
            >
              {connectionState === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Connected!
                </>
              ) : (isLoading || isConnecting) ? (
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

            {renderConnectionState()}
            
            {/* Debug info */}
            <div className="text-xs text-center text-text/50 space-y-1">
              <div>App ID: {import.meta.env.VITE_PRIVY_APP_ID ? 'Configured' : 'Missing'}</div>
              <div>Status: {connectionState}</div>
              {debugInfo.length > 0 && (
                <div className="mt-2 p-2 bg-gray-800 rounded text-left">
                  <div className="font-mono text-xs">Debug Log:</div>
                  {debugInfo.map((log, i) => (
                    <div key={i} className="font-mono text-xs text-gray-300">{log}</div>
                  ))}
                </div>
              )}
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
