
export const useWizardStepTitles = (step: number, wantsAdvanced: boolean, lastStep: number) => {
  const getStepTitle = () => {
    if (step === 1) return "Describe Your Project";
    if (step === 2) return "Define Roles & Revenue Split";
    if (step === 3) return "Budget Breakdown";
    if (step === 4) return "Token Customization";
    if (wantsAdvanced && step === 5) return "Advanced Token Customization";
    if (step === lastStep) return "Launch Your Drop";
    return "Create Your Drop";
  };

  return { getStepTitle };
};
