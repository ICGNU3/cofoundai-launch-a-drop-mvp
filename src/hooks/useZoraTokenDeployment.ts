
import { useState } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { createCreatorClient } from '@zoralabs/protocol-sdk';
import { useToast } from '@/hooks/use-toast';

export interface TokenDeploymentParams {
  name: string;
  symbol: string;
  description: string;
  maxSupply: string;
  pricePerToken: string;
  creatorAddress: string;
  media: Array<{ file: File; type: string; preview: string }>;
}

export interface DeploymentResult {
  contractAddress: string;
  transactionHash: string;
  tokenId?: string;
}

export function useZoraTokenDeployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [deploymentError, setDeploymentError] = useState<Error | null>(null);
  
  const { address, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { toast } = useToast();

  const uploadMediaToIPFS = async (media: Array<{ file: File; type: string; preview: string }>) => {
    // For now, we'll use a placeholder IPFS upload
    // In production, you'd integrate with a proper IPFS service like Pinata or IPFS.tech
    const mockIPFSHash = 'QmMockHashFor' + Math.random().toString(36).substr(2, 9);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      image: `ipfs://${mockIPFSHash}`,
      animation_url: media.length > 1 ? `ipfs://${mockIPFSHash}_animation` : undefined
    };
  };

  const deployToken = async (params: TokenDeploymentParams): Promise<DeploymentResult | null> => {
    if (!walletClient || !publicClient || !address || !chain) {
      throw new Error('Wallet not connected or chain not available');
    }

    setIsDeploying(true);
    setDeploymentError(null);
    
    try {
      toast({
        title: "Starting Deployment",
        description: "Uploading media and preparing token...",
      });

      // Step 1: Upload media to IPFS
      const mediaMetadata = await uploadMediaToIPFS(params.media);

      // Step 2: Create Zora creator client
      const creatorClient = createCreatorClient({
        chainId: chain.id,
        publicClient,
      });

      toast({
        title: "Creating Token",
        description: "Deploying your token contract...",
      });

      // Step 3: Create the token contract
      const { parameters } = await creatorClient.create1155({
        contract: {
          name: params.name,
          uri: `data:application/json;base64,${btoa(JSON.stringify({
            name: params.name,
            description: params.description,
            image: mediaMetadata.image,
            animation_url: mediaMetadata.animation_url,
            attributes: [
              { trait_type: "Symbol", value: params.symbol },
              { trait_type: "Max Supply", value: params.maxSupply },
              { trait_type: "Creator", value: params.creatorAddress }
            ]
          }))}`,
        },
        token: {
          tokenMetadataURI: `data:application/json;base64,${btoa(JSON.stringify({
            name: params.name,
            description: params.description,
            image: mediaMetadata.image,
            animation_url: mediaMetadata.animation_url,
          }))}`,
          maxSupply: BigInt(params.maxSupply),
          createReferral: params.creatorAddress as `0x${string}`,
        },
        account: address,
      });

      // Step 4: Execute the transaction
      const hash = await walletClient.writeContract(parameters);
      
      toast({
        title: "Transaction Submitted",
        description: "Waiting for confirmation...",
      });

      // Step 5: Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status === 'success') {
        // Extract contract address from logs
        const contractAddress = receipt.contractAddress || receipt.logs[0]?.address || '';
        
        const result: DeploymentResult = {
          contractAddress,
          transactionHash: hash,
          tokenId: '1' // First token ID for 1155 contracts
        };
        
        setDeploymentResult(result);
        
        toast({
          title: "🎉 Deployment Successful!",
          description: "Your token has been deployed to the blockchain",
        });
        
        return result;
      } else {
        throw new Error('Transaction failed');
      }
      
    } catch (error) {
      console.error('Token deployment error:', error);
      const deployError = error instanceof Error ? error : new Error('Unknown deployment error');
      setDeploymentError(deployError);
      
      toast({
        title: "Deployment Failed",
        description: deployError.message,
        variant: "destructive",
      });
      
      throw deployError;
    } finally {
      setIsDeploying(false);
    }
  };

  const resetDeployment = () => {
    setDeploymentResult(null);
    setDeploymentError(null);
  };

  return {
    deployToken,
    isDeploying,
    deploymentResult,
    deploymentError,
    resetDeployment,
    isConnected: !!address,
    chainId: chain?.id
  };
}
