
# NEPLUS Subgraph

This subgraph indexes events from the Zora Factory and Creator Royalty Hook contracts to provide real-time analytics for NEPLUS coins and their associated pools.

## Entities

- **Coin**: Basic information about each deployed NEPLUS coin
- **PoolStat**: Aggregated statistics for each pool (volume, depth, fees, etc.)
- **RoyaltyFlow**: Individual royalty payment events
- **LPPosition**: Liquidity provider positions and unclaimed rewards
- **SwapEvent**: Individual swap transactions
- **DailyPoolStat**: Daily aggregated statistics

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update the contract addresses in `subgraph.yaml` and `networks.json`

3. Generate types:
```bash
npm run codegen
```

4. Build the subgraph:
```bash
npm run build
```

5. Deploy to The Graph hosted service:
```bash
npm run deploy
```

## Environment Variables

Set these in your `.env.local`:

```
SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/neplus/neplus-zora
```

## Queries

### Get Pool Statistics
```graphql
query GetPoolStats($coinAddress: String!) {
  coin(id: $coinAddress) {
    id
    symbol
    name
    poolStat {
      volume24h
      depth
      feeAPR
      totalRoyalties
    }
  }
}
```

### Get Recent Royalty Flows
```graphql
query GetRoyaltyFlows($coinAddress: String!) {
  royaltyFlows(
    where: { coin: $coinAddress }
    orderBy: blockTime
    orderDirection: desc
    first: 100
  ) {
    amount
    blockTime
    payer
  }
}
```

## API Integration

The subgraph data is consumed by the `/api/pool-stats` endpoint which provides:

- Real-time pool depth and 24h volume
- Dynamic fee APR calculations
- Unclaimed royalty totals for LPs
- Historical daily statistics
- Recent royalty payment events

## Development

For local development with a local Graph node:

```bash
npm run create-local
npm run deploy-local
```

Make sure you have a local Graph node running with IPFS.
