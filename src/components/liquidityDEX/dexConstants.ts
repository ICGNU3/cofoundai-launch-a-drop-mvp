
export const DEX_URLS = {
  ethereum: {
    uniswap: (token1: string, token2: string) =>
      `https://app.uniswap.org/#/add/v2/${token1}/${token2}`,
    uniswapTrade: (token1: string, token2: string) =>
      `https://app.uniswap.org/#/swap?inputCurrency=${token1}&outputCurrency=${token2}`,
  },
  polygon: {
    uniswap: (token1: string, token2: string) =>
      `https://app.uniswap.org/?chain=polygon#/add/v2/${token1}/${token2}`,
    uniswapTrade: (token1: string, token2: string) =>
      `https://app.uniswap.org/?chain=polygon#/swap?inputCurrency=${token1}&outputCurrency=${token2}`,
  },
  base: {
    uniswap: (token1: string, token2: string) =>
      `https://app.uniswap.org/?chain=base#/add/v2/${token1}/${token2}`,
    uniswapTrade: (token1: string, token2: string) =>
      `https://app.uniswap.org/?chain=base#/swap?inputCurrency=${token1}&outputCurrency=${token2}`,
  },
};

export const defaultPairedToken = {
  symbol: "USDC",
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
};
