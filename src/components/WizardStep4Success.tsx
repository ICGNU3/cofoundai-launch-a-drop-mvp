
import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AccentButton } from "./ui/AccentButton";
import { useToast } from "@/hooks/use-toast";
import type { Role, Expense, ProjectType } from "@/hooks/useWizardState";
import { useNavigate } from "react-router-dom";

interface WizardStep4SuccessProps {
  projectIdea: string;
  projectType: ProjectType;
  roles: Role[];
  expenses: Expense[];
  pledgeUSDC: string;
  walletAddress: string | null;
  onRestart: () => void;
}

export const WizardStep4Success: React.FC<WizardStep4SuccessProps> = ({
  projectIdea,
  projectType,
  roles,
  expenses,
  pledgeUSDC,
  walletAddress,
  onRestart,
}) => {
  const { user } = usePrivy();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMinting, setIsMinting] = useState(false);
  const [mintingStatus, setMintingStatus] = useState<string>("Ready to mint...");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [usdcxBalanceConfirmed, setUsdcxBalanceConfirmed] = useState(false);
  const [isPollingBalance, setIsPollingBalance] = useState(false);

  // Calculate values
  const expenseSum = expenses.reduce((sum, exp) => sum + exp.amountUSDC, 0);
  const pledgeNum = Number(pledgeUSDC) || 0;
  const fundingTarget = expenseSum + pledgeNum;

  // Save project to database
  const saveProjectMutation = useMutation({
    mutationFn: async (mintData: {
      tokenAddress: string;
      txHash: string;
    }) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Create project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          owner_id: user.id,
          project_idea: projectIdea,
          project_type: projectType,
          pledge_usdc: pledgeNum,
          wallet_address: walletAddress,
          funding_target: fundingTarget,
          expense_sum: expenseSum,
          token_address: mintData.tokenAddress,
          tx_hash: mintData.txHash,
          escrow_funded_amount: pledgeNum,
          streams_active: false,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create project roles
      const rolesData = roles.map(role => ({
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
      const expensesData = expenses.map(expense => ({
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
    onSuccess: (project) => {
      setProjectId(project.id);
      setMintingStatus("✅ Project saved to database!");
      sessionStorage.setItem('autoNavigateToProject', project.id);
      
      // Start polling for USDCx balance
      setIsPollingBalance(true);
      pollUSDCxBalance();
    },
    onError: (error) => {
      console.error("Error saving project:", error);
      setMintingStatus("❌ Error saving project");
      toast({
        title: "Database Error",
        description: "Failed to save project to database",
        variant: "destructive",
      });
    },
  });

  // Simulate polling for USDCx balance confirmation
  const pollUSDCxBalance = async () => {
    try {
      // Simulate polling with delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // TODO: Replace with actual USDCx balance check
      // const balance = await checkUSDCxBalance(walletAddress);
      
      setUsdcxBalanceConfirmed(true);
      setIsPollingBalance(false);
      toast({
        title: "Balance Confirmed",
        description: "USDCx balance increase detected",
      });
    } catch (error) {
      console.error("Error polling balance:", error);
      setIsPollingBalance(false);
      toast({
        title: "Balance Check Failed",
        description: "Could not confirm USDCx balance increase",
        variant: "destructive",
      });
    }
  };

  // Simulate minting process with error handling
  const handleMintAndFund = async () => {
    if (!walletAddress) return;

    setIsMinting(true);
    setMintingStatus("🎨 Uploading metadata to Pinata...");

    try {
      // Simulate Pinata upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Replace with actual Pinata call
      // const metadataUrl = await uploadToPinata({...});
      
      setMintingStatus("🚀 Minting token on Zora...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Replace with actual Zora call
      // const zoraResult = await mintOnZora({...});
      
      setMintingStatus("⛽ Confirming transaction...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful mint with mock data
      const mockTokenAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      setMintingStatus("💾 Saving to database...");
      
      // Save to database
      await saveProjectMutation.mutateAsync({
        tokenAddress: mockTokenAddress,
        txHash: mockTxHash,
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      setMintingStatus("🎉 Drop launched successfully!");

      toast({
        title: "Mint Successful",
        description: "Your drop has been launched successfully!",
      });

    } catch (error) {
      console.error("Minting error:", error);
      setMintingStatus("❌ Minting failed");
      
      // Determine error type and show appropriate toast
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      if (errorMessage.includes("Pinata")) {
        toast({
          title: "Pinata Upload Failed",
          description: "Failed to upload metadata to Pinata",
          variant: "destructive",
        });
      } else if (errorMessage.includes("Zora")) {
        toast({
          title: "Zora Mint Failed", 
          description: "Failed to mint token on Zora",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Mint Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsMinting(false);
    }
  };

  // Auto-navigate to project dashboard when available
  useEffect(() => {
    if (projectId && !isMinting && mintingStatus.includes("successfully")) {
      const timer = setTimeout(() => {
        navigate(`/project/${projectId}/dashboard`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [projectId, isMinting, mintingStatus, navigate]);

  return (
    <div className="space-y-6 relative">
      {/* Loading Overlay */}
      {isMinting && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-lg font-semibold text-body-text">Minting...</div>
            <div className="text-sm text-body-text/70 mt-2">{mintingStatus}</div>
          </div>
        </div>
      )}

      <div className="text-center">
        <h2 className="headline mb-4">Ready to Launch! 🚀</h2>
        <div className="space-y-2 text-body-text">
          <div><strong>Project:</strong> {projectIdea}</div>
          <div><strong>Type:</strong> {projectType}</div>
          <div><strong>Roles:</strong> {roles.length} team members</div>
          <div><strong>Expenses:</strong> ${expenseSum.toFixed(2)} USDC</div>
          <div><strong>Target Funding:</strong> ${fundingTarget.toFixed(2)} USDC</div>
        </div>
      </div>

      {/* Minting Status */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-body-text mb-2">
            {mintingStatus}
          </div>
          {(isMinting || isPollingBalance) && (
            <div className="w-full bg-background rounded-full h-2">
              <div className="bg-accent h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
            </div>
          )}
          {isPollingBalance && (
            <div className="text-sm text-yellow-500 mt-2">
              Checking USDCx balance...
            </div>
          )}
        </div>
      </div>

      {/* Project Preview */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-body-text mb-3">Team & Budget</h3>
        <div className="space-y-2 text-sm">
          {roles.map((role, i) => (
            <div key={i} className="flex justify-between">
              <span>{role.roleName}</span>
              <span>{role.percent}%</span>
            </div>
          ))}
        </div>
        <hr className="my-3 border-border" />
        <div className="space-y-1 text-sm">
          {expenses.map((expense, i) => (
            <div key={i} className="flex justify-between">
              <span>{expense.expenseName}</span>
              <span>${expense.amountUSDC} {expense.payoutType === "immediate" ? "(Upfront)" : "(On Success)"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {!projectId && (
          <AccentButton
            className="w-full"
            onClick={handleMintAndFund}
            disabled={!walletAddress || isMinting}
          >
            {isMinting ? "Minting..." : "🚀 Mint & Fund Drop"}
          </AccentButton>
        )}
        
        {projectId && (
          <>
            <AccentButton
              className="w-full"
              onClick={() => navigate(`/project/${projectId}/dashboard`)}
            >
              View Project Dashboard
            </AccentButton>
            
            <AccentButton
              className="w-full"
              disabled={!usdcxBalanceConfirmed}
              onClick={() => {
                toast({
                  title: "Project Completed",
                  description: "Project marked as complete!",
                });
              }}
            >
              {usdcxBalanceConfirmed ? "Mark Complete ✓" : "Confirming Balance..."}
            </AccentButton>
            
            {!usdcxBalanceConfirmed && (
              <div className="text-xs text-yellow-500 text-center">
                Waiting for USDCx balance confirmation
              </div>
            )}
          </>
        )}

        <AccentButton
          secondary
          className="w-full"
          onClick={onRestart}
          disabled={isMinting}
        >
          Launch Another Drop
        </AccentButton>
      </div>
    </div>
  );
};
