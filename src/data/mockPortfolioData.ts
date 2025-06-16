
export const mockTokenHoldings = [
  {
    tokenAddress: '0x1234567890123456789012345678901234567890',
    symbol: 'FILMX',
    name: 'Film Production Token',
    balance: '1,250.50',
    valueUSD: 562.25,
    priceChange24h: 5.67,
    logoUrl: undefined
  },
  {
    tokenAddress: '0x2345678901234567890123456789012345678901',
    symbol: 'MUSICX',
    name: 'Music Creation Token',
    balance: '890.25',
    valueUSD: 401.25,
    priceChange24h: -2.34,
    logoUrl: undefined
  },
  {
    tokenAddress: '0x3456789012345678901234567890123456789012',
    symbol: 'GAMEX',
    name: 'Game Development Token',
    balance: '2,100.00',
    valueUSD: 945.00,
    priceChange24h: 12.45,
    logoUrl: undefined
  }
];

export const mockTradingActivity = [
  {
    id: '1',
    type: 'buy' as const,
    tokenSymbol: 'FILMX',
    tokenName: 'Film Production Token',
    amount: '500.00',
    priceUSD: 0.45,
    totalUSD: 225.00,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    txHash: '0xabcd1234567890abcd1234567890abcd12345678'
  },
  {
    id: '2',
    type: 'sell' as const,
    tokenSymbol: 'MUSICX',
    tokenName: 'Music Creation Token',
    amount: '200.00',
    priceUSD: 0.51,
    totalUSD: 102.00,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    txHash: '0xefgh5678901234efgh5678901234efgh56789012'
  },
  {
    id: '3',
    type: 'buy' as const,
    tokenSymbol: 'GAMEX',
    tokenName: 'Game Development Token',
    amount: '1,000.00',
    priceUSD: 0.42,
    totalUSD: 420.00,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    txHash: '0xijkl9012345678ijkl9012345678ijkl90123456'
  }
];

export const mockPortfolioData = [
  { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), totalValue: 1750.00, dayChange: -2.1 },
  { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), totalValue: 1820.50, dayChange: 4.0 },
  { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), totalValue: 1780.25, dayChange: -2.2 },
  { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), totalValue: 1845.75, dayChange: 3.7 },
  { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), totalValue: 1890.00, dayChange: 2.4 },
  { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), totalValue: 1925.30, dayChange: 1.9 },
  { timestamp: new Date().toISOString(), totalValue: 1908.50, dayChange: -0.9 }
];

export const mockTrendingCoins = [
  {
    id: '0x1234567890123456789012345678901234567890',
    symbol: 'MUSIC',
    name: 'Music Creator Coin',
    logoUrl: undefined
  },
  {
    id: '0x0987654321098765432109876543210987654321',
    symbol: 'ART',
    name: 'Digital Art Coin',
    logoUrl: undefined
  }
];

export const mockLiquidityPositions = [
  {
    id: '1',
    coinSymbol: 'MUSIC',
    coinName: 'Music Creator Coin',
    liquidity: '1250.50',
    unclaimedRoyalties: '12.34',
    feeAPR: '8.5'
  },
  {
    id: '2',
    coinSymbol: 'ART',
    coinName: 'Digital Art Coin',
    liquidity: '890.25',
    unclaimedRoyalties: '5.67',
    feeAPR: '12.1'
  }
];
