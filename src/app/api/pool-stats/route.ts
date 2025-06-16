
import { NextRequest, NextResponse } from 'next/server';

const SUBGRAPH_URL = process.env.SUBGRAPH_URL || '';
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
    throw new Error('SUBGRAPH_URL not configured');
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coinAddress = searchParams.get('coin');

    if (!coinAddress) {
      return NextResponse.json(
        { error: 'Missing coin parameter' },
        { status: 400 }
      );
    }

    // Normalize address to lowercase
    const normalizedAddress = coinAddress.toLowerCase();

    // Fetch pool stats from subgraph
    const poolData = await fetchSubgraphData(POOL_STATS_QUERY, {
      coinAddress: normalizedAddress,
    });

    if (!poolData.coin) {
      return NextResponse.json(
        { error: 'Coin not found' },
        { status: 404 }
      );
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

    // Set cache headers
    const headers = new Headers();
    headers.set('Cache-Control', `public, max-age=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`);
    headers.set('Content-Type', 'application/json');

    return new NextResponse(JSON.stringify(response), {
      headers,
    });

  } catch (error) {
    console.error('Pool stats API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch pool stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
