
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Users, Coins, Gift } from 'lucide-react';
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
        <h2 className="text-2xl font-bold mb-2">Preview Your Campaign</h2>
        <p className="text-gray-600">
          Review all your settings before launching
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Media Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Media Content
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {dropData.media.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {dropData.media.slice(0, 4).map((item, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                    {item.type === 'image' ? (
                      <img
                        src={item.preview}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.preview}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
                {dropData.media.length > 4 && (
                  <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-sm text-gray-600">
                      +{dropData.media.length - 4} more
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No media uploaded</p>
            )}
          </CardContent>
        </Card>

        {/* Token Configuration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Token Details
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(2)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{dropData.tokenConfig.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Symbol:</span>
              <Badge variant="secondary">{dropData.tokenConfig.symbol || 'N/A'}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Supply:</span>
              <span className="font-medium">
                {dropData.tokenConfig.totalSupply ? Number(dropData.tokenConfig.totalSupply).toLocaleString() : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">{dropData.tokenConfig.price || '0'} ETH</span>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Preview */}
        <Card className="lg:col-span-2">
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
            {dropData.rewards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dropData.rewards.map((reward, index) => (
                  <div key={reward.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{reward.title}</h4>
                      <Badge variant="outline" className="ml-2">
                        {reward.tokenThreshold} token{reward.tokenThreshold !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                    {reward.customDetails && (
                      <p className="text-xs text-blue-600 mt-2">{reward.customDetails}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No rewards configured</p>
            )}
          </CardContent>
        </Card>

        {/* Project Description */}
        {dropData.tokenConfig.description && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {dropData.tokenConfig.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Launch Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Ready to Launch!</h3>
              <p className="text-sm text-green-600">
                Your drop is configured and ready to go live
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-700">{dropData.media.length}</div>
              <div className="text-xs text-green-600">Media Files</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">
                {dropData.tokenConfig.totalSupply ? Number(dropData.tokenConfig.totalSupply).toLocaleString() : '0'}
              </div>
              <div className="text-xs text-green-600">Token Supply</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">{dropData.rewards.length}</div>
              <div className="text-xs text-green-600">Rewards</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">{dropData.tokenConfig.price || '0'}</div>
              <div className="text-xs text-green-600">ETH Price</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
