
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, ExternalLink, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { DropData } from '@/hooks/useDropBuilder';
import { useToast } from '@/hooks/use-toast';

interface LaunchStepProps {
  dropData: DropData;
  onLaunch: () => void;
  isLaunching: boolean;
}

export const LaunchStep: React.FC<LaunchStepProps> = ({
  dropData,
  onLaunch,
  isLaunching
}) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  // Mock launch URLs - in real implementation, these would come from the actual launch
  const mockZoraUrl = `https://zora.co/collect/base/0x1234567890123456789012345678901234567890`;
  const mockSocialText = `🚀 Just launched my new drop "${dropData.tokenConfig.name}" on @zora! Check it out and become a supporter 👇`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Launch Your Drop</h2>
        <p className="text-gray-600">
          Deploy your project to Zora and share with the world
        </p>
      </div>

      {!isLaunching ? (
        <>
          {/* Pre-Launch Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Final Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{dropData.media.length}</div>
                    <div className="text-sm text-gray-600">Media Files</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{Number(dropData.tokenConfig.totalSupply).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Supply</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{dropData.rewards.length}</div>
                    <div className="text-sm text-gray-600">Rewards</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">What happens when you launch:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Your media will be uploaded to IPFS for permanent storage</li>
                    <li>• Token contract will be deployed to Base network via Zora</li>
                    <li>• Campaign page will be live on Zora marketplace</li>
                    <li>• Supporters can start minting your tokens immediately</li>
                    <li>• All configuration will be saved for future reference</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Launch Button */}
          <div className="flex justify-center">
            <Button
              onClick={onLaunch}
              size="lg"
              className="gap-2 px-8 py-4 text-lg"
            >
              <Rocket className="w-5 h-5" />
              Launch My Drop
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Launching State */}
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">Launching Your Drop...</h3>
              <p className="text-gray-600 mb-4">
                Please wait while we deploy your project to Zora
              </p>
              <div className="space-y-2 text-sm text-left max-w-md mx-auto">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Uploading media to IPFS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span>Deploying token contract</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                  <span>Creating marketplace listing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Success State - This would be shown after successful launch */}
      {/* Uncomment when implementing success state */}
      {/*
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Drop Launched Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-green-700">
              Your drop is now live and supporters can start minting tokens!
            </p>
            
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <a href={mockZoraUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Zora
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(mockZoraUrl)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-green-800">Share your drop:</p>
              <div className="p-3 bg-white rounded border border-green-200">
                <p className="text-sm">{mockSocialText}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(mockSocialText)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      */}
    </div>
  );
};
