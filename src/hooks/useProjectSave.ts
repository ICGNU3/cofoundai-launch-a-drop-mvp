
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectSaveData {
  projectIdea: string;
  projectType: any;
  roles: any[];
  expenses: any[];
  pledgeUSDC: string;
  walletAddress: string | null;
  fundingTarget: number;
  expenseSum: number;
  tokenAddress?: string;
  txHash?: string;
  poolAddress?: string;
}

export const useProjectSave = () => {
  return useMutation({
    mutationFn: async (data: ProjectSaveData) => {
      console.log('Saving project with data:', data);
      
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          title: data.projectIdea,
          description: data.projectIdea,
          project_type: data.projectType?.value || data.projectType,
          funding_target: data.fundingTarget,
          expense_sum: data.expenseSum,
          pledge_usdc: data.pledgeUSDC,
          wallet_address: data.walletAddress,
          token_address: data.tokenAddress,
          tx_hash: data.txHash,
          pool_address: data.poolAddress,
          status: data.tokenAddress ? 'minted' : 'draft',
          roles: data.roles,
          expenses: data.expenses
        })
        .select()
        .single();

      if (error) {
        console.error('Project save error:', error);
        throw new Error(`Failed to save project: ${error.message}`);
      }

      console.log('Project saved successfully:', project);
      return project;
    },
  });
};
