
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { DropData } from '@/hooks/useDropBuilder';

interface TokenLaunchAssistantProps {
  onRecommendationsReady: (recommendations: Partial<DropData>) => void;
  onProceedToBuilder: () => void;
}

export const TokenLaunchAssistant: React.FC<TokenLaunchAssistantProps> = ({
  onRecommendationsReady,
  onProceedToBuilder
}) => {
  const [userInput, setUserInput] = useState('');
  const {
    messages,
    isLoading,
    currentPhase,
    recommendations,
    sendMessage,
    proceedToNextPhase,
    isComplete
  } = useAIAssistant();

  const handleSendMessage = () => {
    if (userInput.trim()) {
      sendMessage(userInput);
      setUserInput('');
    }
  };

  const handleApplyRecommendations = () => {
    if (recommendations) {
      onRecommendationsReady(recommendations);
      onProceedToBuilder();
    }
  };

  const getPhaseTitle = (phase: string) => {
    switch (phase) {
      case 'goals': return 'Understanding Your Goals';
      case 'content': return 'Content & Community Analysis';
      case 'strategy': return 'Launch Strategy';
      case 'recommendations': return 'Personalized Recommendations';
      default: return 'AI Launch Assistant';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-blue-600" />
            {getPhaseTitle(currentPhase)}
          </CardTitle>
          <p className="text-gray-600">
            I'll help you create the perfect token launch strategy tailored to your project
          </p>
        </CardHeader>
      </Card>

      {/* Conversation */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, idx) => (
                        <Badge key={idx} variant="secondary" className="mr-1">
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          {!isComplete && (
            <div className="mt-4 flex gap-2">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tell me about your project, goals, or ask any questions..."
                className="flex-1"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isLoading}
                className="self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Phase Navigation */}
          {!isComplete && currentPhase !== 'recommendations' && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={proceedToNextPhase}
                disabled={isLoading}
                className="gap-2"
              >
                Continue to Next Phase
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations Summary */}
      {isComplete && recommendations && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Sparkles className="w-5 h-5" />
              AI Recommendations Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Token Configuration</h4>
                  <p><strong>Name:</strong> {recommendations.tokenConfig?.name}</p>
                  <p><strong>Symbol:</strong> {recommendations.tokenConfig?.symbol}</p>
                  <p><strong>Price:</strong> {recommendations.tokenConfig?.price} ETH</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Launch Strategy</h4>
                  <p><strong>Rewards:</strong> {recommendations.rewards?.length || 0} configured</p>
                  <p><strong>Supply:</strong> {recommendations.tokenConfig?.totalSupply}</p>
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleApplyRecommendations}
                  className="gap-2"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4" />
                  Apply to Drop Builder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
