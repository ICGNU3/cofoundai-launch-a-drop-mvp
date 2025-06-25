
import { AIMessage, ConversationPhase, UserResponses } from './types';

export async function generateAIResponse(
  userInput: string, 
  phase: ConversationPhase, 
  previousResponses: UserResponses
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

export function shouldAdvancePhase(phase: ConversationPhase, userInput: string): boolean {
  // Simple logic to determine when to auto-advance
  return userInput.length > 20; // If user gives a substantial response
}

export function getPhaseTransitionMessage(phase: ConversationPhase): AIMessage {
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
