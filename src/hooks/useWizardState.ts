
import React from "react";

export type WizardStep = 1 | 2 | 3;

export interface WizardStateData {
  step: WizardStep;
  projectIdea: string;
  modelChoice: "openai" | "claude" | "gemini";
  crewSplit: number; // 0-100, producer%, artist% = 100 - crewSplit
  pledgeUSDC: string; // number, but string for input control
  walletAddress: string | null;
  isWizardOpen: boolean;
}
const defaultIdea = "Lo-Fi Night Drive EP";

export function useWizardState() {
  const [state, setState] = React.useState<WizardStateData>({
    step: 1,
    projectIdea: defaultIdea,
    modelChoice: "openai",
    crewSplit: 30, // Artist 70 / Producer 30
    pledgeUSDC: "",
    walletAddress: null,
    isWizardOpen: false,
  });

  const setStep = (step: WizardStep) => setState(s => ({ ...s, step }));
  const setField = <K extends keyof WizardStateData>(k: K, v: WizardStateData[K]) =>
    setState(s => ({ ...s, [k]: v }));

  const openWizard = () => setField("isWizardOpen", true);
  const closeWizard = () => setField("isWizardOpen", false);

  return {
    state,
    setState,
    setStep,
    setField,
    openWizard,
    closeWizard,
  };
}
