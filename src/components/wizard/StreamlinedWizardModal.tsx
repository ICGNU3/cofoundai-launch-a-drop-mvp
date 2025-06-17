
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { StreamlinedProgressBar } from "./StreamlinedProgressBar";
import { DemoProjectsInspiration } from "./DemoProjectsInspiration";
import { useStreamlinedWizard } from "@/hooks/wizard/useStreamlinedWizard";
import { WizardStep1Describe } from "./steps/WizardStep1Describe";
import { WizardStep2TeamBudget } from "./steps/WizardStep2TeamBudget";
import { WizardStep3Launch } from "./steps/WizardStep3Launch";

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

  const renderStepContent = () => {
    if (showInspiration) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <DemoProjectsInspiration onSelectDemo={handleDemoSelect} />
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowInspiration(false)}
                className="text-sm text-accent hover:underline"
              >
                ← Back to project setup
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (wizard.state.step) {
      case 1:
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <WizardStep1Describe
                state={wizard.state}
                updateField={wizard.updateField}
                nextStep={wizard.nextStep}
                onShowInspiration={() => setShowInspiration(true)}
                walletAddress={walletAddress}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <WizardStep2TeamBudget
                state={wizard.state}
                updateField={wizard.updateField}
                nextStep={wizard.nextStep}
                prevStep={wizard.prevStep}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <WizardStep3Launch
                state={wizard.state}
                updateField={wizard.updateField}
                prevStep={wizard.prevStep}
                onComplete={onClose}
                walletAddress={walletAddress}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl h-[90vh] max-h-[800px] p-0 bg-card flex flex-col">
        <DialogTitle className="sr-only">Create Your Drop</DialogTitle>
        <DialogDescription className="sr-only">
          Launch your creative project in just 3 simple steps
        </DialogDescription>
        
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-text">Create Your Drop</h2>
            <p className="text-sm text-text/70 mt-1">
              Launch your creative project in just 3 simple steps
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar - Fixed */}
        {!showInspiration && (
          <div className="flex-shrink-0">
            <StreamlinedProgressBar currentStep={wizard.state.step} />
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="flex-1 min-h-0">
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
