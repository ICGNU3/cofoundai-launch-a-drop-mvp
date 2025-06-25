
import { DropData, TokenConfig, SupporterReward } from '@/hooks/useDropBuilder';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

export type ConversationPhase = 'goals' | 'content' | 'strategy' | 'recommendations';

export interface AIRecommendations {
  tokenConfig: TokenConfig;
  rewards: SupporterReward[];
  launchStrategy: {
    recommendedTier: string;
    marketingTips: string[];
    pricingStrategy: string;
  };
}

export interface UserResponses {
  [key: string]: string;
}
