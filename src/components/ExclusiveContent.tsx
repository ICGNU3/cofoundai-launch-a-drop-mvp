
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ExternalLink, Gift, Download } from 'lucide-react';

interface ExclusiveContentProps {
  creatorName: string;
  tokenSymbol: string;
}

export const ExclusiveContent: React.FC<ExclusiveContentProps> = ({ 
  creatorName, 
  tokenSymbol 
}) => {
  const exclusiveVideos = [
    {
      id: 1,
      title: "Behind the Scenes: Studio Session",
      description: "Exclusive footage from my latest recording session",
      thumbnail: "/placeholder.svg",
      duration: "12:45",
      type: "video"
    },
    {
      id: 2,
      title: "Creative Process Documentary",
      description: "Deep dive into how I create my content",
      thumbnail: "/placeholder.svg",
      duration: "25:30",
      type: "video"
    }
  ];

  const exclusiveLinks = [
    {
      id: 1,
      title: "Private Discord Server",
      description: "Join our exclusive community",
      url: "https://discord.gg/exclusive",
      icon: ExternalLink
    },
    {
      id: 2,
      title: "Early Access to New Drops",
      description: "Get notified 24 hours before public release",
      url: "https://forms.gle/early-access",
      icon: ExternalLink
    }
  ];

  const merchCodes = [
    {
      id: 1,
      code: "HOLDER20",
      description: "20% off all merchandise",
      validUntil: "Dec 31, 2024"
    },
    {
      id: 2,
      code: "EXCLUSIVE50",
      description: "50% off limited edition items",
      validUntil: "Jan 15, 2025"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome, {tokenSymbol} Holder! 🎉</h2>
        <p className="text-gray-600">
          You now have access to {creatorName}'s exclusive content
        </p>
      </div>

      {/* Exclusive Videos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Exclusive Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exclusiveVideos.map((video) => (
              <div key={video.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="relative mb-3">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-32 object-cover rounded-md bg-gray-200"
                  />
                  <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                    {video.duration}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-1">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                <Button size="sm" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Now
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exclusive Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Exclusive Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exclusiveLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <link.icon className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium">{link.title}</h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(link.url, '_blank')}
                >
                  Access
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Merch Codes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Exclusive Merch Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {merchCodes.map((merch) => (
              <div key={merch.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-lg font-mono font-bold text-purple-700">
                    {merch.code}
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(merch.code);
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <p className="text-sm font-medium">{merch.description}</p>
                <p className="text-xs text-gray-500 mt-1">Valid until {merch.validUntil}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
