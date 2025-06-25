
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bot, Sparkles, Zap, Brain } from 'lucide-react';
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
        className="relative group bg-gradient-to-r from-gradient-start via-accent to-gradient-end hover:from-gradient-start/90 hover:via-accent/90 hover:to-gradient-end/90 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 px-8 py-4 text-lg font-semibold"
        size="lg"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gradient-start to-gradient-end opacity-50 rounded-lg blur-md group-hover:blur-lg transition-all duration-300" />
        
        {/* Button content */}
        <div className="relative flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <Bot className="w-5 h-5" />
          </div>
          <span>AI Launch Assistant</span>
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <Zap className="w-4 h-4 animate-pulse delay-150" />
          </div>
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gradient-start via-accent to-gradient-end opacity-20 animate-gradient bg-[length:200%_200%]" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-surface-elevated border-border">
          <DialogHeader className="pb-6">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-text-primary">
              <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-accent/20 to-gradient-end/20 rounded-lg border border-accent/30">
                <Brain className="w-6 h-6 text-accent" />
                <Bot className="w-6 h-6 text-gradient-end" />
              </div>
              AI Token Launch Assistant
              <div className="flex items-center gap-1 ml-2">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-sm text-text-muted font-normal">Powered by AI</span>
              </div>
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
