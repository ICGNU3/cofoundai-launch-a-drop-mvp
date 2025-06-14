
import React from "react";
import { useWizardState } from "@/hooks/useWizardState";
import { AccentButton } from "./ui/AccentButton";
import { CrewSplitSlider } from "./CrewSplitSlider";

export const WizardModal: React.FC<{
  state: ReturnType<typeof useWizardState>["state"];
  setField: ReturnType<typeof useWizardState>["setField"];
  setStep: (s: 1 | 2 | 3) => void;
  close: () => void;
}> = ({ state, setField, setStep, close }) => {
  // For MVP, modal overlay and simple transitions only
  if (!state.isWizardOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm transition">
      <div className="card w-[95vw] max-w-lg mx-auto relative animate-fade-in">
        <button
          className="absolute top-3 right-4 text-body-text opacity-70 hover:opacity-100"
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>
        {/* Header Step Indicator */}
        <div className="flex justify-center mb-6">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className={`mx-1 w-6 h-2 rounded-full ${state.step === n
                ? "bg-accent"
                : "bg-[#333]"}`}
            />
          ))}
        </div>
        {state.step === 1 && (
          <div>
            <h2 className="headline mb-2 text-center">Describe Your Project Idea</h2>
            <textarea
              className="w-full p-3 rounded-lg bg-[#1c1c1c] text-body-text border border-border focus:border-accent outline-none mb-6 min-h-[100px] resize-none"
              value={state.projectIdea}
              maxLength={256}
              onChange={e => setField("projectIdea", e.target.value)}
              placeholder='Three-track lo-fi EP...'
            />
            <AccentButton className="w-full mt-2" onClick={() => setStep(2)}>
              Next: Choose Model →
            </AccentButton>
          </div>
        )}
        {state.step === 2 && (
          <div>
            <h2 className="headline mb-4 text-center">Choose AI Model</h2>
            <div className="flex flex-col gap-3 mb-6">
              <label className={`flex items-center p-3 rounded-lg border ${state.modelChoice === "openai" ? "border-accent bg-accent/10" : "border-border hover:border-accent/80"}`}>
                <input
                  type="radio"
                  className="accent"
                  value="openai"
                  checked={state.modelChoice === "openai"}
                  onChange={() => setField("modelChoice", "openai")}
                />
                <span className="ml-3 font-semibold text-accent">OpenAI</span>
                <span className="ml-2 text-xs text-body-text opacity-70">Best all-around (copy + art)</span>
              </label>
              <label className={`flex items-center p-3 rounded-lg border ${state.modelChoice === "claude" ? "border-accent bg-accent/10" : "border-border hover:border-accent/80"}`}>
                <input
                  type="radio"
                  className="accent"
                  value="claude"
                  checked={state.modelChoice === "claude"}
                  onChange={() => setField("modelChoice", "claude")}
                />
                <span className="ml-3 font-semibold text-accent">Claude</span>
                <span className="ml-2 text-xs text-body-text opacity-70">Best launch copy</span>
              </label>
              <label className={`flex items-center p-3 rounded-lg border ${state.modelChoice === "gemini" ? "border-accent bg-accent/10" : "border-border hover:border-accent/80"}`}>
                <input
                  type="radio"
                  className="accent"
                  value="gemini"
                  checked={state.modelChoice === "gemini"}
                  onChange={() => setField("modelChoice", "gemini")}
                />
                <span className="ml-3 font-semibold text-accent">Gemini</span>
                <span className="ml-2 text-xs text-body-text opacity-70">Free backup</span>
              </label>
            </div>
            <div className="flex gap-2">
              <AccentButton secondary className="w-1/2" onClick={() => setStep(1)}>
                ← Back
              </AccentButton>
              <AccentButton className="w-1/2" onClick={() => setStep(3)}>
                Next: Crew & Cut →
              </AccentButton>
            </div>
          </div>
        )}
        {state.step === 3 && (
          <div>
            <h2 className="headline mb-4 text-center">Crew &amp; Cut + Pledge</h2>
            <CrewSplitSlider
              value={state.crewSplit}
              onChange={v => setField("crewSplit", v)}
            />
            <label className="block mt-5 mb-2 font-medium text-body-text">
              (Optional) Pledge in USDC
            </label>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              placeholder="e.g. 100"
              value={state.pledgeUSDC}
              onChange={e => setField("pledgeUSDC", e.target.value.replace(/^0+/, ""))}
              className="w-full p-3 rounded-lg bg-[#1c1c1c] text-body-text border border-border focus:border-accent outline-none"
            />
            <div className="flex flex-col gap-3 mt-6">
              {/* Simulate Connect Wallet as button */}
              {!state.walletAddress ? (
                <AccentButton
                  className="w-full"
                  onClick={() => setField("walletAddress", "0x1234...5678")}
                >
                  Connect Wallet (Demo)
                </AccentButton>
              ) : (
                <div className="rounded border border-accent px-4 py-3 text-accent mb-2 text-center font-mono text-sm">
                  {state.walletAddress}
                </div>
              )}
              <AccentButton
                className="w-full"
                disabled={!state.walletAddress}
                onClick={() => {/* coming soon: handle wizard next */}}
              >
                Mint &amp; Fund
              </AccentButton>
              <AccentButton
                secondary
                className="w-full"
                onClick={() => setStep(2)}
              >
                ← Back
              </AccentButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
