
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Image, Video, Gift } from 'lucide-react';
import { DropData } from '@/hooks/useDropBuilder';

interface CampaignPreviewStepProps {
  dropData: DropData;
  onEdit: (step: number) => void;
}

export const CampaignPreviewStep: React.FC<CampaignPreviewStepProps> = ({
  dropData,
  onEdit
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Campaign Preview</h2>
        <p className="text-gray-600">
          Review your drop before launching
        </p>
      </div>

      {/* Media Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Media ({dropData.media.length})
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dropData.media.map((item, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                {item.type === 'image' ? (
                  <img
                    src={item.preview}
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token Configuration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Token Configuration</CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(2)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">{dropData.tokenConfig.name}</h3>
              <p className="text-gray-600 mb-4">{dropData.tokenConfig.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Symbol:</span>
                  <span className="font-mono">{dropData.tokenConfig.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Supply:</span>
                  <span>{Number(dropData.tokenConfig.totalSupply).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Initial Price:</span>
                  <span>{dropData.tokenConfig.price} ETH</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {dropData.tokenConfig.symbol}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supporter Rewards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Supporter Rewards ({dropData.rewards.length})
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(3)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dropData.rewards.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{reward.title}</h4>
                  <p className="text-sm text-gray-600">{reward.description}</p>
                </div>
                <Badge variant="secondary">
                  {reward.tokenThreshold} token{reward.tokenThreshold !== 1 ? 's' : ''}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Launch Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Ready to Launch!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-green-700">
            <p>✅ {dropData.media.length} media file{dropData.media.length !== 1 ? 's' : ''} uploaded</p>
            <p>✅ Token configured: {dropData.tokenConfig.name} ({dropData.tokenConfig.symbol})</p>
            <p>✅ {dropData.rewards.length} supporter reward{dropData.rewards.length !== 1 ? 's' : ''} defined</p>
            <p className="pt-2 font-medium">
              Your drop will be deployed to Zora and become available for supporters to mint.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
