
import { useState } from "react";
import type { MintingState, MintingError } from "./types";

export function useMintingState() {
  const [state, setState] = useState<MintingState>({
    coverIpfs: null,
    projectId: null,
    loadingMint: false,
    poolAddress: null,
    mintModalOpen: false,
    lastError: null,
  });

  const setCoverIpfs = (coverIpfs: string | null) => 
    setState(prev => ({ ...prev, coverIpfs }));

  const setProjectId = (projectId: string | null) => 
    setState(prev => ({ ...prev, projectId }));

  const setLoadingMint = (loadingMint: boolean) => 
    setState(prev => ({ ...prev, loadingMint }));

  const setPoolAddress = (poolAddress: string | null) => 
    setState(prev => ({ ...prev, poolAddress }));

  const setMintModalOpen = (mintModalOpen: boolean) => 
    setState(prev => ({ ...prev, mintModalOpen }));

  const setLastError = (lastError: string | null) => 
    setState(prev => ({ ...prev, lastError }));

  return {
    ...state,
    setCoverIpfs,
    setProjectId,
    setLoadingMint,
    setPoolAddress,
    setMintModalOpen,
    setLastError,
  };
}
