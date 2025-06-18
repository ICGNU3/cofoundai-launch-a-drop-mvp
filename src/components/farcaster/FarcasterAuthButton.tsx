
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, CheckCircle, ExternalLink } from 'lucide-react';

interface FarcasterUser {
  fid: string;
  username: string;
  displayName: string;
  pfpUrl: string;
  followerCount: number;
  followingCount: number;
}

interface FarcasterAuthButtonProps {
  onAuthSuccess?: (user: FarcasterUser) => void;
  onAuthError?: (error: string) => void;
}

export function FarcasterAuthButton({ onAuthSuccess, onAuthError }: FarcasterAuthButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedUser, setConnectedUser] = useState<FarcasterUser | null>(null);
  const { toast } = useToast();

  const handleFarcasterAuth = async () => {
    setIsConnecting(true);

    try {
      // In a real implementation, this would use Farcaster Connect
      // For demo purposes, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockUser: FarcasterUser = {
        fid: '12345',
        username: 'creator.eth',
        displayName: 'Creative Creator',
        pfpUrl: '/placeholder.svg',
        followerCount: 1250,
        followingCount: 890
      };

      setConnectedUser(mockUser);
      onAuthSuccess?.(mockUser);

      toast({
        title: "Connected to Farcaster!",
        description: `Welcome ${mockUser.displayName}! Your Farcaster identity is now linked.`,
      });

    } catch (error) {
      const errorMessage = "Failed to connect to Farcaster. Please try again.";
      onAuthError?.(errorMessage);
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setConnectedUser(null);
    toast({
      title: "Disconnected",
      description: "Your Farcaster account has been disconnected.",
    });
  };

  if (connectedUser) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Farcaster Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src={connectedUser.pfpUrl} 
              alt={connectedUser.displayName}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-semibold">{connectedUser.displayName}</div>
              <div className="text-sm text-text/70">@{connectedUser.username}</div>
            </div>
          </div>
          
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold">{connectedUser.followerCount.toLocaleString()}</div>
              <div className="text-text/60">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{connectedUser.followingCount.toLocaleString()}</div>
              <div className="text-text/60">Following</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleDisconnect}
              className="flex-1"
            >
              Disconnect
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open(`https://warpcast.com/${connectedUser.username}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      onClick={handleFarcasterAuth}
      disabled={isConnecting}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
    >
      <User className="w-4 h-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect with Farcaster"}
    </Button>
  );
}
