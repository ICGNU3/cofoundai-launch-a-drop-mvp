
import React from "react";

interface UseWizardSkipLogicProps {
  step: number;
  doAdvancedToken: boolean;
  lastStep: number;
  setStep: (step: number) => void;
}

export const useWizardSkipLogic = ({
  step,
  doAdvancedToken,
  lastStep,
  setStep,
}: UseWizardSkipLogicProps) => {
  const hasSkippedStep5 = React.useRef(false);

  React.useEffect(() => {
    console.log("[useWizardSkipLogic] Check skip logic", {
      step,
      doAdvancedToken,
      lastStep,
      hasSkippedStep5: hasSkippedStep5.current,
    });

    if (
      step === 5 &&
      !doAdvancedToken &&
      lastStep > 5 &&
      !hasSkippedStep5.current
    ) {
      console.log("[useWizardSkipLogic] Auto-skipping step 5, going to step", lastStep);
      hasSkippedStep5.current = true;
      setStep(lastStep);
    }
    
    if (step !== 5) {
      hasSkippedStep5.current = false;
    }
  }, [step, doAdvancedToken, lastStep, setStep]);

  const resetSkipFlag = () => {
    hasSkippedStep5.current = false;
  };

  return { resetSkipFlag };
};
