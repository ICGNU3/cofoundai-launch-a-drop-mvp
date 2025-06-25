
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DropData, TokenConfig, SupporterReward } from '@/hooks/useDropBuilder';

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

type ConversationPhase = 'goals' | 'content' | 'strategy' | 'recommendations';

interface AIRecommendations {
  tokenConfig: TokenConfig;
  rewards: SupporterReward[];
  launchStrategy: {
    recommendedTier: string;
    marketingTips: string[];
    pricingStrategy: string;
  };
}

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
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
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

// Helper functions
async function generateAIResponse(
  userInput: string, 
  phase: ConversationPhase, 
  previousResponses: Record<string, string>
): Promise<AIMessage> {
  // In a real implementation, this would call OpenAI API
  // For now, we'll use predefined responses based on phase
  
  const responses: Record<ConversationPhase, AIMessage> = {
    goals: {
      role: 'assistant',
      content: "Great! Now tell me about your goals. Are you looking to build a community, fund a specific project, create ongoing revenue, or establish long-term fan relationships?",
      suggestions: ['Build Community', 'Fund Project', 'Create Revenue Stream', 'Fan Relationships']
    },
    content: {
      role: 'assistant',
      content: "Excellent! Now let's talk about your content and community. Do you already have an existing audience? What type of content will token holders get access to?",
      suggestions: ['Existing Audience', 'New Creator', 'Exclusive Content', 'Early Access', 'Physical Merch']
    },
    strategy: {
      role: 'assistant',
      content: "Perfect! For your launch strategy, what's your budget range and timeline? Are you planning a one-time drop or ongoing releases?",
      suggestions: ['Under $1k Budget', '$1k-5k Budget', '$5k+ Budget', 'One-time Drop', 'Ongoing Series']
    },
    recommendations: {
      role: 'assistant',
      content: "Based on everything you've shared, I'm generating your personalized launch recommendations..."
    }
  };

  return responses[phase];
}

function shouldAdvancePhase(phase: ConversationPhase, userInput: string): boolean {
  // Simple logic to determine when to auto-advance
  return userInput.length > 20; // If user gives a substantial response
}

function getPhaseTransitionMessage(phase: ConversationPhase): AIMessage {
  const messages: Record<ConversationPhase, string> = {
    goals: "Let's start with your goals...",
    content: "Now let's discuss your content strategy...",
    strategy: "Time to plan your launch strategy...",
    recommendations: "Generating your recommendations..."
  };

  return {
    role: 'assistant',
    content: messages[phase]
  };
}

function createRecommendationsFromResponses(responses: Record<string, string>): Partial<DropData> {
  // Analyze responses and generate smart defaults
  const projectType = responses.goals?.toLowerCase() || '';
  const hasAudience = responses.content?.toLowerCase().includes('existing') || false;
  const budget = responses.strategy?.toLowerCase() || '';

  // Generate token config based on responses
  const tokenConfig: TokenConfig = {
    name: extractProjectName(responses.goals) || 'My Creative Token',
    symbol: generateSymbol(responses.goals) || 'MCT',
    totalSupply: hasAudience ? '50000' : '10000',
    description: generateDescription(responses),
    price: budget.includes('5k+') ? '0.01' : budget.includes('1k') ? '0.005' : '0.001'
  };

  // Generate rewards based on content type
  const rewards: SupporterReward[] = generateRewards(responses.content);

  return {
    tokenConfig,
    rewards
  };
}

function extractProjectName(goalsResponse: string): string {
  // Simple extraction - in real implementation, use NLP
  const words = goalsResponse.split(' ');
  return words.length > 2 ? words.slice(0, 3).join(' ') : 'My Creative Project';
}

function generateSymbol(goalsResponse: string): string {
  const words = goalsResponse.split(' ').filter(w => w.length > 2);
  return words.slice(0, 3).map(w => w[0].toUpperCase()).join('');
}

function generateDescription(responses: Record<string, string>): string {
  return `A creative token project focused on ${responses.goals || 'community building'} with ${responses.content || 'exclusive content'} for supporters.`;
}

function generateRewards(contentResponse: string): SupporterReward[] {
  const rewards: SupporterReward[] = [];
  const content = contentResponse.toLowerCase();

  if (content.includes('merch') || content.includes('physical')) {
    rewards.push({
      id: '1',
      type: 'early_merch',
      title: 'Early Merch Access',
      description: '20% off merchandise before public release',
      tokenThreshold: 10
    });
  }

  if (content.includes('exclusive') || content.includes('content')) {
    rewards.push({
      id: '2',
      type: 'exclusive_content',
      title: 'Exclusive Content',
      description: 'Behind-the-scenes videos and photos',
      tokenThreshold: 5
    });
  }

  if (content.includes('digital') || content.includes('download')) {
    rewards.push({
      id: '3',
      type: 'digital_access',
      title: 'Digital Downloads',
      description: 'High-quality digital files and early releases',
      tokenThreshold: 1
    });
  }

  return rewards.length > 0 ? rewards : [{
    id: '1',
    type: 'digital_access',
    title: 'Supporter Access',
    description: 'Exclusive digital content for supporters',
    tokenThreshold: 1
  }];
}
