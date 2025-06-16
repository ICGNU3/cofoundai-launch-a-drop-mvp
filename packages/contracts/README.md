
# CreatorRoyaltyHook

A Uniswap V4 hook that collects royalties for creators on every swap.

## Features

- Configurable royalty percentage (in basis points)
- Automatic royalty collection before each swap
- Royalties sent directly to creator address
- Event emission for tracking royalty payments
- Remaining fees flow to liquidity providers

## Installation

```bash
cd packages/contracts
make install
```

## Testing

```bash
make test
```

## Deployment

1. Copy `.env.example` to `.env` and fill in your values:
   - `PRIVATE_KEY`: Your deployment private key
   - `CREATOR_ADDRESS`: Address to receive royalties
   - `ROYALTY_BPS`: Royalty percentage in basis points (250 = 2.5%)

2. Deploy to Zora testnet:
```bash
make deploy-zora-testnet
```

The deployment script will output the hook address and encoded hook flags needed for pool creation.

## Usage

The hook automatically:
1. Calculates royalty as `amountIn * royaltyBps / 10_000`
2. Transfers royalty to the creator address
3. Emits `RoyaltyPaid(address payer, uint256 amount)` event
4. Allows remaining swap to proceed normally

## Hook Permissions

This hook only requires `beforeSwap` permission, making it lightweight and gas-efficient.
