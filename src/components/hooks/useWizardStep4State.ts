
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectById } from "@/hooks/useProjectById";
import { useToast } from "@/hooks/use-toast";
import { useMintingWorkflow } from "./useMintingWorkflow";

export function useWizardStep4State({
  coverBase64,
  projectIdea,
  projectType,
  roles,
  expenses,
  pledgeUSDC,
  walletAddress,
  tokenCustomization,
}: {
  coverBase64?: string | null;
  projectIdea: string;
  projectType: any;
  roles: any[];
  expenses: any[];
  pledgeUSDC: string;
  walletAddress: string | null;
  tokenCustomization?: any;
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [generatedContent, setGeneratedContent] = useState<any>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedProjectRow, setCompletedProjectRow] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Calculate values
  const expenseSum = expenses.reduce((sum, exp) => sum + exp.amountUSDC, 0);
  const pledgeNum = Number(pledgeUSDC) || 0;
  const fundingTarget = expenseSum + pledgeNum;

  // Minting workflow
  const mintingWorkflow = useMintingWorkflow({
    coverBase64,
    projectIdea,
    projectType,
    roles,
    expenses,
    pledgeUSDC,
    walletAddress,
    expenseSum,
    fundingTarget,
    onSaveComplete: (projectRow: any) => {
      setCompletedProjectRow(projectRow);
    },
  });

  // Get project from DB after mint
  const { data: projectRow, isLoading: isProjectLoading } = useProjectById(mintingWorkflow.projectId);

  // Redirect after mint if project is not complete
  useEffect(() => {
    if (projectRow && projectRow.status !== "complete" && projectRow.id) {
      navigate(`/project/${projectRow.id}/dashboard`);
    }
  }, [projectRow, navigate]);

  // Show confetti if complete
  useEffect(() => {
    if (mintingWorkflow.projectId && mintingWorkflow.currentStep === "complete") {
      setShowConfetti(true);
      const timeout = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timeout);
    } else {
      setShowConfetti(false);
    }
  }, [mintingWorkflow.projectId, mintingWorkflow.currentStep]);

  // Redirect to Project Launch Hub after minting is complete
  useEffect(() => {
    if (projectRow && mintingWorkflow.currentStep === "complete" && projectRow.id) {
      navigate(`/project/${projectRow.id}/launch`);
    }
  }, [projectRow, mintingWorkflow.currentStep, navigate]);

  // Share button handler
  const handleShareDrop = () => {
    if (!mintingWorkflow.projectId) return;
    const url = `${window.location.origin}/project/${mintingWorkflow.projectId}/dashboard`;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Drop link copied!",
          description: "Share your drop's dashboard with collaborators.",
        });
      })
      .catch(() => {
        toast({
          title: "Oops!",
          description: "Couldn't copy the link. Please try again.",
          variant: "destructive",
        });
      });
  };

  // Determine token name/symbol for summary display
  const isDefaultToken = !tokenCustomization;
  const isMinted = projectRow?.status === "minted";

  return {
    activeTab,
    setActiveTab,
    generatedContent,
    setGeneratedContent,
    showConfetti,
    containerRef,
    expenseSum,
    fundingTarget,
    projectRow,
    isProjectLoading,
    handleShareDrop,
    isDefaultToken,
    isMinted,
    mintingWorkflow,
  };
}
