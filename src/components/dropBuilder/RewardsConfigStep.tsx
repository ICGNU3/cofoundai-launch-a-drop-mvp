
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Gift, Edit, Trash2, Lock } from 'lucide-react';
import { SupporterReward } from '@/hooks/useDropBuilder';
import { PaymentGate } from '../PaymentGate';

interface RewardsConfigStepProps {
  rewards: SupporterReward[];
  onRewardsUpdate: (rewards: SupporterReward[]) => void;
  canUseCustom: boolean;
}

const REWARD_TYPES = [
  { value: 'early_merch', label: 'Early Merch Access', description: '20% off merchandise before public release' },
  { value: 'digital_access', label: 'Digital Access', description: 'Exclusive digital content and downloads' },
  { value: 'exclusive_content', label: 'Exclusive Content', description: 'Behind-the-scenes videos and photos' },
  { value: 'meet_greet', label: 'Meet & Greet', description: 'Virtual or in-person meet and greet opportunity' },
  { value: 'custom', label: 'Custom Reward', description: 'Create your own unique reward' }
];

export const RewardsConfigStep: React.FC<RewardsConfigStepProps> = ({
  rewards,
  onRewardsUpdate,
  canUseCustom
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<SupporterReward | null>(null);
  const [formData, setFormData] = useState({
    type: 'early_merch',
    title: '',
    description: '',
    tokenThreshold: 1,
    customDetails: ''
  });

  const resetForm = () => {
    setFormData({
      type: 'early_merch',
      title: '',
      description: '',
      tokenThreshold: 1,
      customDetails: ''
    });
    setEditingReward(null);
  };

  const handleSaveReward = () => {
    const rewardType = REWARD_TYPES.find(r => r.value === formData.type);
    
    const newReward: SupporterReward = {
      id: editingReward?.id || Date.now().toString(),
      type: formData.type as any,
      title: formData.title || rewardType?.label || '',
      description: formData.description || rewardType?.description || '',
      tokenThreshold: formData.tokenThreshold,
      customDetails: formData.customDetails
    };

    if (editingReward) {
      const updatedRewards = rewards.map(r => r.id === editingReward.id ? newReward : r);
      onRewardsUpdate(updatedRewards);
    } else {
      onRewardsUpdate([...rewards, newReward]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEditReward = (reward: SupporterReward) => {
    setEditingReward(reward);
    setFormData({
      type: reward.type,
      title: reward.title,
      description: reward.description,
      tokenThreshold: reward.tokenThreshold,
      customDetails: reward.customDetails || ''
    });
    setIsDialogOpen(true);
  };

  const handleDeleteReward = (id: string) => {
    const updatedRewards = rewards.filter(r => r.id !== id);
    onRewardsUpdate(updatedRewards);
  };

  const handleTypeChange = (value: string) => {
    if (value === 'custom' && !canUseCustom) {
      return; // Prevent selection if not allowed
    }
    
    const rewardType = REWARD_TYPES.find(r => r.value === value);
    setFormData(prev => ({
      ...prev,
      type: value,
      title: rewardType?.label || '',
      description: rewardType?.description || ''
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Define Supporter Rewards</h2>
        <p className="text-gray-600">
          Create exclusive perks for your token holders
        </p>
      </div>

      {/* Custom Rewards Gate */}
      {!canUseCustom && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Lock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-sm text-gray-600 mb-2">
              Custom rewards and advanced reward features are available with Pro Launch
            </p>
            <PaymentGate 
              requiredTier="pro" 
              featureName="Custom Rewards Setup"
            >
              <></>
            </PaymentGate>
          </CardContent>
        </Card>
      )}

      {/* Add Reward Button */}
      <div className="flex justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Reward
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingReward ? 'Edit Reward' : 'Add Supporter Reward'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Reward Type</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REWARD_TYPES.map(type => (
                      <SelectItem 
                        key={type.value} 
                        value={type.value}
                        disabled={type.value === 'custom' && !canUseCustom}
                      >
                        {type.label} {type.value === 'custom' && !canUseCustom && '(Pro Only)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reward Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter reward title"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this reward"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Minimum Tokens Required</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.tokenThreshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, tokenThreshold: parseInt(e.target.value) || 1 }))}
                />
              </div>

              {formData.type === 'custom' && canUseCustom && (
                <div className="space-y-2">
                  <Label>Custom Details</Label>
                  <Textarea
                    value={formData.customDetails}
                    onChange={(e) => setFormData(prev => ({ ...prev, customDetails: e.target.value }))}
                    placeholder="Additional details for this custom reward"
                    rows={2}
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveReward} className="flex-1">
                  {editingReward ? 'Update' : 'Add'} Reward
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rewards List */}
      {rewards.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Configured Rewards</h3>
          <div className="grid gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Gift className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">{reward.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                        <p className="text-xs text-gray-500">
                          Requires {reward.tokenThreshold} token{reward.tokenThreshold !== 1 ? 's' : ''}
                        </p>
                        {reward.customDetails && (
                          <p className="text-xs text-blue-600 mt-1">
                            {reward.customDetails}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditReward(reward)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteReward(reward.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <Gift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No rewards configured</h3>
            <p className="text-gray-500">
              Add some exclusive perks to incentivize supporters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
