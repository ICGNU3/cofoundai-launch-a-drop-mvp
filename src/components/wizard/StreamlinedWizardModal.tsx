
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { StreamlinedProgressBar } from "./StreamlinedProgressBar";
import { DemoProjectsInspiration } from "./DemoProjectsInspiration";
import { useStreamlinedWizard } from "@/hooks/wizard/useStreamlinedWizard";
import { WizardStep1Describe } from "./steps/WizardStep1Describe";
import { WizardStep2TeamBudget } from "./steps/WizardStep2TeamBudget";
import { WizardStep3Launch } from "./steps/WizardStep3Launch";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface StreamlinedWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
}

export const StreamlinedWizardModal: React.FC<StreamlinedWizardModalProps> = ({
  isOpen,
  onClose,
  walletAddress,
}) => {
  const wizard = useStreamlinedWizard();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showInspiration, setShowInspiration] = React.useState(false);

  const handleDemoSelect = (demo: any) => {
    wizard.updateField("projectIdea", demo.example.projectIdea);
    wizard.updateField("projectType", demo.type);
    
    // Convert demo roles to wizard format
    const roles = demo.example.roles.map((role: any, index: number) => ({
      name: role.name,
      percent: role.percent,
      percentNum: role.percent,
      percentStr: role.percent.toString(),
      address: index === 0 ? walletAddress || "" : "",
      isFixed: false,
    }));
    
    // Convert demo expenses to wizard format
    const expenses = demo.example.expenses.map((expense: any) => ({
      name: expense.name,
      amountUSDC: expense.amount,
      description: `Budget allocation for ${expense.name.toLowerCase()}`,
    }));
    
    wizard.updateField("roles", roles);
    wizard.updateField("expenses", expenses);
    wizard.updateField("mode", "team");
    
    setShowInspiration(false);
    wizard.nextStep();
  };

  const handleWizardComplete = () => {
    // Reset wizard state
    wizard.closeWizard();
    
    // Close modal
    onClose();
    
    // Navigate to dashboard to see the new project
    navigate("/dashboard");
    
    toast({
      title: "Welcome to your new project! 🎉",
      description: "Your project is now live and ready for supporters. Check it out in your dashboard.",
    });
  };

  const renderStepContent = () => {
    if (showInspiration) {
      return (
        <div className="p-4 sm:p-6">
          <DemoProjectsInspiration onSelectDemo={handleDemoSelect} />
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowInspiration(false)}
              className="text-sm text-accent hover:underline p-2"
            >
              ← Back to project setup
            </button>
          </div>
        </div>
      );
    }

    switch (wizard.state.step) {
      case 1:
        return (
          <WizardStep1Describe
            state={wizard.state}
            updateField={wizard.updateField}
            nextStep={wizard.nextStep}
            onShowInspiration={() => setShowInspiration(true)}
            walletAddress={walletAddress}
          />
        );
      case 2:
        return (
          <WizardStep2TeamBudget
            state={wizard.state}
            updateField={wizard.updateField}
            nextStep={wizard.nextStep}
            prevStep={wizard.prevStep}
          />
        );
      case 3:
        return (
          <WizardStep3Launch
            state={wizard.state}
            updateField={wizard.updateField}
            prevStep={wizard.prevStep}
            onComplete={handleWizardComplete}
            walletAddress={walletAddress}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-none sm:max-w-4xl h-[100dvh] sm:h-[90vh] max-h-none sm:max-h-[800px] p-0 bg-card m-0 sm:m-auto rounded-none sm:rounded-lg border-0 sm:border">
        <DialogTitle className="sr-only">Create Your Drop</DialogTitle>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-10">
            <div className="min-w-0 flex-1 pr-2">
              <h2 className="text-lg sm:text-xl font-bold text-text truncate">Create Your Drop</h2>
              <p className="text-xs sm:text-sm text-text/70 mt-1 hidden sm:block">
                Launch your creative project in just 3 simple steps
              </p>
              <p className="text-xs text-text/70 mt-1 sm:hidden">
                Launch in 3 steps
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-2 hover:bg-background rounded-lg transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          {!showInspiration && (
            <StreamlinedProgressBar currentStep={wizard.state.step} />
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {renderStepContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
