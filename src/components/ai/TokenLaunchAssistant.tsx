
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Sparkles, ArrowRight, Loader2, Brain, Zap, Target, Lightbulb } from 'lucide-react';
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

  const getPhaseInfo = (phase: string) => {
    switch (phase) {
      case 'goals':
        return {
          title: 'Understanding Your Goals',
          icon: Target,
          color: 'text-accent',
          bgColor: 'bg-accent/10'
        };
      case 'content':
        return {
          title: 'Content & Community Analysis',
          icon: Lightbulb,
          color: 'text-gradient-end',
          bgColor: 'bg-gradient-end/10'
        };
      case 'strategy':
        return {
          title: 'Launch Strategy',
          icon: Zap,
          color: 'text-crypto-green',
          bgColor: 'bg-crypto-green/10'
        };
      case 'recommendations':
        return {
          title: 'Personalized Recommendations',
          icon: Sparkles,
          color: 'text-crypto-blue',
          bgColor: 'bg-crypto-blue/10'
        };
      default:
        return {
          title: 'AI Launch Assistant',
          icon: Brain,
          color: 'text-accent',
          bgColor: 'bg-accent/10'
        };
    }
  };

  const phaseInfo = getPhaseInfo(currentPhase);
  const PhaseIcon = phaseInfo.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <Card className="border-accent/30 bg-gradient-to-r from-accent/5 to-gradient-end/5 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${phaseInfo.bgColor} border border-current/20`}>
              <PhaseIcon className={`w-7 h-7 ${phaseInfo.color}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">{phaseInfo.title}</h2>
              <p className="text-text-secondary text-base mt-1">
                I'll help you create the perfect token launch strategy tailored to your project
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Conversation */}
      <Card className="bg-surface-elevated/50 backdrop-blur-sm border-border">
        <CardContent className="p-8">
          <div className="space-y-6 min-h-[500px] max-h-[600px] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-accent to-gradient-end text-white shadow-lg'
                      : 'bg-surface border border-border text-text-primary shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.role === 'assistant' && (
                      <div className="p-1.5 bg-accent/20 rounded-lg border border-accent/30 flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-accent" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {message.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <Badge 
                              key={idx} 
                              variant="secondary" 
                              className="bg-white/10 text-white/90 border-white/20 hover:bg-white/20 transition-colors cursor-pointer text-xs"
                              onClick={() => setUserInput(suggestion)}
                            >
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3 shadow-md">
                  <div className="p-1.5 bg-accent/20 rounded-lg border border-accent/30">
                    <Bot className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span className="text-sm text-text-secondary">AI is analyzing your input...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          {!isComplete && (
            <div className="mt-8 space-y-4">
              <div className="flex gap-3">
                <Textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Tell me about your project, goals, or ask any questions..."
                  className="flex-1 bg-surface border-border focus:border-accent/50 focus:ring-accent/20 resize-none"
                  rows={3}
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
                  className="self-end bg-gradient-to-r from-accent to-gradient-end hover:from-accent/90 hover:to-gradient-end/90 text-white shadow-button hover:shadow-button-hover transition-all duration-300"
                  size="lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Phase Navigation */}
              {!isComplete && currentPhase !== 'recommendations' && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={proceedToNextPhase}
                    disabled={isLoading}
                    className="gap-2 bg-surface-elevated border-border hover:bg-card text-text-secondary hover:text-text-primary transition-all duration-300"
                  >
                    Continue to Next Phase
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations Summary */}
      {isComplete && recommendations && (
        <Card className="border-crypto-green/30 bg-gradient-to-r from-crypto-green/5 to-success/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-success">
              <div className="p-3 bg-success/20 rounded-2xl border border-success/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">AI Recommendations Ready</h3>
                <p className="text-sm text-text-secondary font-normal mt-1">
                  Your personalized launch strategy has been generated
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-surface-elevated/50 border-border">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      Token Configuration
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Name:</span>
                        <span className="text-text-primary font-medium">{recommendations.tokenConfig?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Symbol:</span>
                        <span className="text-text-primary font-medium">{recommendations.tokenConfig?.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Price:</span>
                        <span className="text-text-primary font-medium">{recommendations.tokenConfig?.price} ETH</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-surface-elevated/50 border-border">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-gradient-end" />
                      Launch Strategy
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Rewards:</span>
                        <span className="text-text-primary font-medium">{recommendations.rewards?.length || 0} configured</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Supply:</span>
                        <span className="text-text-primary font-medium">{recommendations.tokenConfig?.totalSupply}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-center pt-6">
                <Button
                  onClick={handleApplyRecommendations}
                  className="gap-3 bg-gradient-to-r from-success to-crypto-green hover:from-success/90 hover:to-crypto-green/90 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 px-8 py-4 text-lg font-semibold"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Apply to Drop Builder
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
