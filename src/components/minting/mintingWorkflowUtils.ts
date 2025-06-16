
export function getExplorerUrl(chainId: number, txHash: string) {
  // Adjust explorer based on chain, for now assume Zora testnet
  if (chainId === 84532) {
    return `https://testnet.zora.superscan.network/tx/${txHash}`;
  }
  // fallback: etherscan mainnet
  return `https://etherscan.io/tx/${txHash}`;
}

export function identifyErrorType(rawMsg: string) {
  if (
    /user (denied|rejected)/i.test(rawMsg) ||
    /rejected by user/i.test(rawMsg)
  )
    return { isUserRejection: true, code: "USER_REJECTED" };
  if (/insufficient/i.test(rawMsg)) return { code: "INSUFFICIENT_FUNDS" };
  if (/gas/i.test(rawMsg)) return { code: "GAS_ERROR" };
  if (/network/i.test(rawMsg)) return { code: "NETWORK" };
  if (/contract|smart contract/i.test(rawMsg)) return { code: "CONTRACT" };
  return { code: "SYSTEM" };
}

export function getErrorSuggestion(code?: string, userRej?: boolean) {
  if (userRej) return "You rejected the transaction in your wallet. To try again, please confirm the next time the wallet opens.";
  switch (code) {
    case "INSUFFICIENT_FUNDS":
      return "Your wallet doesn't have enough funds to complete this transaction. Please check your balance and add more, then try again.";
    case "GAS_ERROR":
      return "There may be a problem with gas price or fees. Try a higher gas option, or try again later.";
    case "NETWORK":
      return "Network congestion or issues detected. Wait a few moments, then try again.";
    case "CONTRACT":
      return "A smart contract error occurred. Double-check your transaction details, or contact support.";
    default:
      return "Something went wrong! Please review the info below, try again, or reach out to support if the problem persists.";
  }
}

export const supportResources = {
  faqLink: "https://docs.lovable.dev/faq",
  discordLink: "https://discord.gg/62tKPEwDrp",
  contactLink: "mailto:support@lovable.dev",
};
