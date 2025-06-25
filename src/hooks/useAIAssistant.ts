
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DropData } from '@/hooks/useDropBuilder';
import { AIMessage, ConversationPhase, UserResponses } from './ai/types';
import { generateAIResponse, shouldAdvancePhase, getPhaseTransitionMessage } from './ai/responseGenerator';
import { createRecommendationsFromResponses } from './ai/recommendationGenerator';

export function useAIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI launch assistant. I'll help you create the perfect token launch strategy. Let's start by understanding your project. What type of creative work are you launching? (Music, Art, Film, etc.)",
      suggestions: ['Music Album', 'Digital Art Collection', 'Film Project', 'Fashion Line', 'Writing/Book']
    }
  ]);
  
  const [currentPhase, setCurrentPhase] = useState<ConversationPhase>('goals');
  const [isLoading, setIsLoading] = useState(false);
  const [userResponses, setUserResponses] = useState<UserResponses>({});
  const [recommendations, setRecommendations] = useState<Partial<DropData> | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: AIMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Store user response for analysis
    setUserResponses(prev => ({ ...prev, [currentPhase]: content }));

    try {
      // Simulate AI processing with phase-specific responses
      const response = await generateAIResponse(content, currentPhase, userResponses);
      
      setTimeout(() => {
        setMessages(prev => [...prev, response]);
        setIsLoading(false);
        
        // Auto-advance through phases based on conversation flow
        if (shouldAdvancePhase(currentPhase, content)) {
          setTimeout(() => proceedToNextPhase(), 1000);
        }
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentPhase, userResponses, toast]);

  const proceedToNextPhase = useCallback(() => {
    const phases: ConversationPhase[] = ['goals', 'content', 'strategy', 'recommendations'];
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      setCurrentPhase(nextPhase);
      
      // Add phase transition message
      const transitionMessage = getPhaseTransitionMessage(nextPhase);
      setMessages(prev => [...prev, transitionMessage]);
    } else {
      // Generate final recommendations
      generateFinalRecommendations();
    }
  }, [currentPhase, userResponses]);

  const generateFinalRecommendations = useCallback(() => {
    const recs = createRecommendationsFromResponses(userResponses);
    setRecommendations(recs);
    setIsComplete(true);
    
    const finalMessage: AIMessage = {
      role: 'assistant',
      content: "Perfect! I've analyzed your responses and created personalized recommendations for your token launch. Review the summary below and apply these settings to your Drop Builder when you're ready."
    };
    
    setMessages(prev => [...prev, finalMessage]);
  }, [userResponses]);

  return {
    messages,
    isLoading,
    currentPhase,
    recommendations,
    isComplete,
    sendMessage,
    proceedToNextPhase
  };
}
