
/**
* Helper functions for interacting with Zora API for coins and badges.
*/

export async function mintZoraCoin({ chainId, name, symbol, totalSupply, uri, creatorAddress }: {
  chainId: number;
  name: string;
  symbol: string;
  totalSupply: number;
  uri: string;
  creatorAddress: string;
}) {
  const res = await fetch("https://api.zora.co/v4/coins/testnet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chainId, name, symbol, totalSupply, uri, creatorAddress })
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function mintFlexBadges({ chainId, name, symbol, uri, creatorAddress, recipients }: {
  chainId: number;
  name: string;
  symbol: string;
  uri: string;
  creatorAddress: string;
  recipients: string[];
}) {
  const res = await fetch("https://api.zora.co/v4/editions/testnet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chainId, name, symbol, uri, creatorAddress, recipients })
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function fetchTotalSupply(tokenAddress: string) {
  const res = await fetch(`https://api.zora.co/v4/coins/testnet/${tokenAddress}`);
  if (!res.ok) return false;
  const data = await res.json();
  return Number(data?.totalSupply || 0) > 0;
}
