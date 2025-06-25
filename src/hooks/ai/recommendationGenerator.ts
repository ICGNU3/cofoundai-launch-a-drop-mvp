
import { DropData, TokenConfig, SupporterReward } from '@/hooks/useDropBuilder';
import { UserResponses } from './types';

export function createRecommendationsFromResponses(responses: UserResponses): Partial<DropData> {
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

function generateDescription(responses: UserResponses): string {
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
