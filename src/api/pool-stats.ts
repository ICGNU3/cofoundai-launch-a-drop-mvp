
const SUBGRAPH_URL = import.meta.env.VITE_SUBGRAPH_URL || '';
const CACHE_DURATION = 15; // 15 seconds

// GraphQL queries
const POOL_STATS_QUERY = `
  query GetPoolStats($coinAddress: String!) {
    coin(id: $coinAddress) {
      id
      symbol
      name
      creator
      poolStat {
        id
        volume24h
        depth
        feeAPR
        totalVolumeUSD
        totalRoyalties
        lastUpdated
      }
    }
    royaltyFlows(
      where: { coin: $coinAddress }
      orderBy: blockTime
      orderDirection: desc
      first: 100
    ) {
      id
      amount
      blockTime
      payer
    }
    lpPositions(
      where: { pool_: { coin: $coinAddress } }
      orderBy: liquidity
      orderDirection: desc
      first: 50
    ) {
      id
      owner
      liquidity
      unclaimed
    }
  }
`;

const DAILY_STATS_QUERY = `
  query GetDailyStats($poolId: String!, $startTime: Int!) {
    dailyPoolStats(
      where: { pool: $poolId, date_gte: $startTime }
      orderBy: date
      orderDirection: desc
      first: 30
    ) {
      id
      date
      volumeUSD
      royaltiesUSD
      swapCount
      uniqueUsers
    }
  }
`;

const TRENDING_POOLS_QUERY = `
  query GetTrendingPools($orderBy: String!, $orderDirection: String!) {
    poolStats(
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: 20
    ) {
      id
      coin {
        id
        symbol
        name
        creator
      }
      volume24h
      depth
      feeAPR
      totalVolumeUSD
      totalRoyalties
      lastUpdated
    }
  }
`;

interface PoolStatsResponse {
  depth: string;
  volume24h: string;
  feeAPR: string;
  totalVolumeUSD: string;
  totalRoyalties: string;
  unclaimedRoyalties: string;
  lpCount: number;
  recentRoyalties: Array<{
    amount: string;
    blockTime: string;
    payer: string;
  }>;
  dailyStats: Array<{
    date: number;
    volume: string;
    royalties: string;
    swaps: number;
  }>;
  lastUpdated: string;
}

async function fetchSubgraphData(query: string, variables: any) {
  if (!SUBGRAPH_URL) {
    throw new Error('VITE_SUBGRAPH_URL not configured');
  }

  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Subgraph request failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Subgraph errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

function calculateFeeAPR(volume24h: string, depth: string, royaltyBps: number = 500): string {
  const volume = parseFloat(volume24h);
  const liquidity = parseFloat(depth);
  
  if (liquidity === 0) return '0';
  
  // Simplified APR calculation: (daily fees / liquidity) * 365 * 100
  const dailyFees = volume * (royaltyBps / 10000);
  const apr = (dailyFees / liquidity) * 365 * 100;
  
  return apr.toFixed(2);
}

export async function fetchPoolStats(coinAddress: string): Promise<PoolStatsResponse> {
  if (!coinAddress) {
    throw new Error('Missing coin parameter');
  }

  // Normalize address to lowercase
  const normalizedAddress = coinAddress.toLowerCase();

  // Fetch pool stats from subgraph
  const poolData = await fetchSubgraphData(POOL_STATS_QUERY, {
    coinAddress: normalizedAddress,
  });

  if (!poolData.coin) {
    throw new Error('Coin not found');
  }

  const coin = poolData.coin;
  const poolStat = coin.poolStat;

  // Calculate unclaimed royalties for all LP positions
  const unclaimedRoyalties = poolData.lpPositions.reduce(
    (total: number, position: any) => total + parseFloat(position.unclaimed || '0'),
    0
  );

  // Fetch daily stats
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
  const dailyData = await fetchSubgraphData(DAILY_STATS_QUERY, {
    poolId: poolStat.id,
    startTime: Math.floor(thirtyDaysAgo / 86400), // Convert to day ID
  });

  // Calculate dynamic fee APR
  const feeAPR = calculateFeeAPR(poolStat.volume24h, poolStat.depth);

  const response: PoolStatsResponse = {
    depth: poolStat.depth,
    volume24h: poolStat.volume24h,
    feeAPR,
    totalVolumeUSD: poolStat.totalVolumeUSD,
    totalRoyalties: poolStat.totalRoyalties,
    unclaimedRoyalties: unclaimedRoyalties.toString(),
    lpCount: poolData.lpPositions.length,
    recentRoyalties: poolData.royaltyFlows.slice(0, 10).map((flow: any) => ({
      amount: flow.amount,
      blockTime: flow.blockTime,
      payer: flow.payer,
    })),
    dailyStats: dailyData.dailyPoolStats.map((stat: any) => ({
      date: stat.date * 86400, // Convert back to Unix timestamp
      volume: stat.volumeUSD,
      royalties: stat.royaltiesUSD,
      swaps: parseInt(stat.swapCount),
    })),
    lastUpdated: poolStat.lastUpdated,
  };

  return response;
}

export async function fetchTrendingPools(sortBy: 'feeAPR' | 'volume24h' | 'totalVolumeUSD' = 'feeAPR') {
  const data = await fetchSubgraphData(TRENDING_POOLS_QUERY, {
    orderBy: sortBy,
    orderDirection: 'desc'
  });

  return data.poolStats.map((pool: any) => ({
    id: pool.coin.id,
    symbol: pool.coin.symbol,
    name: pool.coin.name,
    creator: pool.coin.creator,
    depth: pool.depth,
    volume24h: pool.volume24h,
    feeAPR: pool.feeAPR,
    totalVolumeUSD: pool.totalVolumeUSD,
    totalRoyalties: pool.totalRoyalties,
    lastUpdated: pool.lastUpdated
  }));
}
