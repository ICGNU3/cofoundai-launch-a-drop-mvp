
import { useMutation } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Role, Expense, ProjectType } from "@/hooks/useWizardState";

interface SaveProjectParams {
  projectIdea: string;
  projectType: ProjectType;
  roles: Role[];
  expenses: Expense[];
  pledgeUSDC: string;
  walletAddress: string | null;
  fundingTarget: number;
  expenseSum: number;
}

export const useProjectSave = () => {
  const { user } = usePrivy();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: SaveProjectParams & { tokenAddress: string; txHash: string }) => {
      if (!user?.id) throw new Error("User not authenticated");

      const pledgeNum = Number(params.pledgeUSDC) || 0;

      // Create project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          owner_id: user.id,
          project_idea: params.projectIdea,
          project_type: params.projectType,
          pledge_usdc: pledgeNum,
          wallet_address: params.walletAddress,
          funding_target: params.fundingTarget,
          expense_sum: params.expenseSum,
          token_address: params.tokenAddress,
          tx_hash: params.txHash,
          escrow_funded_amount: pledgeNum,
          streams_active: false,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create project roles
      const rolesData = params.roles.map(role => ({
        project_id: project.id,
        name: role.roleName,
        percent: role.percent,
        wallet_address: role.walletAddress,
        stream_flow_rate: 0,
        stream_active: false,
      }));

      const { error: rolesError } = await supabase
        .from("project_roles")
        .insert(rolesData);

      if (rolesError) throw rolesError;

      // Create project expenses
      const expensesData = params.expenses.map(expense => ({
        project_id: project.id,
        name: expense.expenseName,
        amount_usdc: expense.amountUSDC,
        payout_type: expense.payoutType,
        vendor_wallet: expense.vendorWallet,
      }));

      const { error: expensesError } = await supabase
        .from("project_expenses")
        .insert(expensesData);

      if (expensesError) throw expensesError;

      return project;
    },
    onError: (error) => {
      console.error("Error saving project:", error);
      toast({
        title: "Database Error",
        description: "Failed to save project to database",
        variant: "destructive",
      });
    },
  });
};
