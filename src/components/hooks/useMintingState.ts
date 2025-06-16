
import { useState } from "react";

export function useMintingState() {
  const [coverIpfs, setCoverIpfs] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loadingMint, setLoadingMint] = useState(false);
  const [poolAddress, setPoolAddress] = useState<string | null>(null);
  const [mintModalOpen, setMintModalOpen] = useState(false);
  
  const [lastError, setLastError] = useState<{
    message: string;
    code?: string;
    txHash?: string;
  } | null>(null);

  return {
    coverIpfs,
    setCoverIpfs,
    projectId,
    setProjectId,
    loadingMint,
    setLoadingMint,
    poolAddress,
    setPoolAddress,
    mintModalOpen,
    setMintModalOpen,
    lastError,
    setLastError,
  };
}
