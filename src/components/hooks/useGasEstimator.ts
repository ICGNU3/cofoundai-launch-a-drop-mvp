
import { useEffect, useState } from "react";

// Example API: ethgasstation.info for Ethereum, or use public Zora endpoints.
// For demo/testing, fallback to static values.
type GasFees = {
  slow: string;
  standard: string;
  fast: string;
};

export function useGasEstimator(chainId: number) {
  const [gasFees, setGasFees] = useState<GasFees>({ slow: "0.0003", standard: "0.00047", fast: "0.00081" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // For production, fetch real gas price data for given chainId.
    // For this demo, we'll use static numbers for Zora testnet.
    setTimeout(() => {
      if (chainId === 84532) {
        setGasFees({
          slow: "0.0003",
          standard: "0.00047",
          fast: "0.00081"
        });
      } else {
        setGasFees({
          slow: "0.0025",
          standard: "0.004",
          fast: "0.008"
        });
      }
      setLoading(false);
    }, 800);
  }, [chainId]);

  return { gasFees, loading };
}
