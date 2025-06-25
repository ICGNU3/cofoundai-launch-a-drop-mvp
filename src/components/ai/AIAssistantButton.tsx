
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bot, Sparkles } from 'lucide-react';
import { TokenLaunchAssistant } from './TokenLaunchAssistant';
import { DropData } from '@/hooks/useDropBuilder';

interface AIAssistantButtonProps {
  onRecommendationsApplied: (data: Partial<DropData>) => void;
}

export const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({
  onRecommendationsApplied
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRecommendationsReady = (recommendations: Partial<DropData>) => {
    onRecommendationsApplied(recommendations);
    setIsOpen(false);
  };

  const handleProceedToBuilder = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        size="lg"
      >
        <Bot className="w-5 h-5" />
        <Sparkles className="w-4 h-4" />
        AI Launch Assistant
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Token Launch Assistant
            </DialogTitle>
          </DialogHeader>
          <TokenLaunchAssistant
            onRecommendationsReady={handleRecommendationsReady}
            onProceedToBuilder={handleProceedToBuilder}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
