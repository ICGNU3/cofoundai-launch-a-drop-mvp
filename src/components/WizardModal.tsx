import React, { useState } from "react";
import { useWizardState } from "@/hooks/useWizardState";
import { AccentButton } from "./ui/AccentButton";
import { RolePill } from "./ui/RolePill";
import { AddRoleModal } from "./ui/AddRoleModal";
import { ExpensePill } from "./ui/ExpensePill";
import { AddExpenseModal } from "./ui/AddExpenseModal";
import { PercentBar } from "./ui/PercentBar";
import { WizardRolesStep } from "./WizardRolesStep";

const projectTypes = ["Music", "Film", "Fashion", "Art", "Other"] as const;

// --- OpenAI Chat API call helper ---
async function fetchTokenMetadata(projectIdea: string) {
  const OPENAI_API_KEY = ""; // TODO: Insert your OpenAI API key here, or inject via environment/Supabase in production!
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const prompt = `Return exactly this JSON:  
{  
  "name": "...",  
  "symbol": "...",  
  "totalSupply": ...,  
  "imagePrompt": "...",  
  "launchCopy": "..."  
}  
For the user’s idea: ${projectIdea}
Bind its response JSON fields to variables: tokenName, tokenSymbol, tokenSupply, imagePrompt, launchCopy.`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 350,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI Error: ${await res.text()}`);
  }

  const data = await res.json();

  // Extract content, find the JSON in the model's completion (assuming OpenAI returns it at top-level)
  let text = "";
  try {
    // Find the completion content (for both OpenAI v1 and v1/chat/completions)
    if (data.choices && data.choices[0] && data.choices[0].message) {
      text = data.choices[0].message.content;
    } else {
      throw new Error("OpenAI did not return a completion.");
    }
    // Strip code blocks if present
    text = text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
    // Parse the JSON block
    const parsed = JSON.parse(text);
    return {
      tokenName: parsed.name,
      tokenSymbol: parsed.symbol,
      tokenSupply: parsed.totalSupply,
      imagePrompt: parsed.imagePrompt,
      launchCopy: parsed.launchCopy,
    };
  } catch (e) {
    throw new Error("Failed to parse OpenAI response: " + (e as Error).message);
  }
}

export const WizardModal: React.FC<{
  state: ReturnType<typeof useWizardState>["state"];
  setField: ReturnType<typeof useWizardState>["setField"];
  setStep: (s: 1 | 2 | 3) => void;
  close: () => void;
  saveRole: ReturnType<typeof useWizardState>["saveRole"];
  removeRole: ReturnType<typeof useWizardState>["removeRole"];
  saveExpense: ReturnType<typeof useWizardState>["saveExpense"];
  removeExpense: ReturnType<typeof useWizardState>["removeExpense"];
  loadDefaultRoles: ReturnType<typeof useWizardState>["loadDefaultRoles"];
}> = ({
  state,
  setField,
  setStep,
  close,
  saveRole,
  removeRole,
  saveExpense,
  removeExpense,
  loadDefaultRoles,
}) => {
  // For MVP, modal overlay and simple transitions only
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  // OpenAI chat state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openaiFields, setOpenaiFields] = useState<{
    tokenName?: string;
    tokenSymbol?: string;
    tokenSupply?: number;
    imagePrompt?: string;
    launchCopy?: string;
  }>({});

  // Percent validation
  const sumPercent = state.roles.reduce((sum, r) => sum + r.percent, 0);
  let percentMsg = "";
  let percentColor = "";
  if (sumPercent < 100)
    percentMsg = `Need ${100 - sumPercent} % allocated`;
  else if (sumPercent > 100)
    percentMsg = `Remove ${sumPercent - 100} % (over-allocated)`;
  else percentMsg = "Cuts balanced ✓";
  percentColor = sumPercent === 100 ? "text-green-400" : "text-red-500";
  const disableStep2Next = sumPercent !== 100;

  // Expense/calculation
  const upfrontExpenses = state.expenses.filter(e => e.payoutType === "immediate");
  const uponOutcomeExpenses = state.expenses.filter(e => e.payoutType === "uponOutcome");
  const expenseSum = upfrontExpenses.reduce((sum, x) => sum + x.amountUSDC, 0);
  const outcomeSum = uponOutcomeExpenses.reduce((sum, x) => sum + x.amountUSDC, 0);
  const pledgeNum = Number(state.pledgeUSDC) || 0;
  const totalNeeded = expenseSum + pledgeNum;

  // PINATA JWT input (for MVP/testing)
  const [pinataJwt, setPinataJwt] = useState<string>("");

  // Helper: Call OpenAI DALL·E 3 with prompt
  async function generateImageDalle3(prompt: string, openaiApiKey: string): Promise<string> {
    const resp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      }),
    });
    if (!resp.ok) throw new Error("DALL·E API call failed");
    const data = await resp.json();
    return data.data[0].url as string;
  }

  // Helper: Fetch image and return base64 (as a PNG file buffer)
  async function fetchImageAsBase64(url: string): Promise<{base64: string, ext: string}> {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Failed to download image");
    const blob = await resp.blob();
    const ext = blob.type.split("/")[1] ?? "png";
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const base64 = btoa(String.fromCharCode(...bytes));
    return { base64, ext };
  }

  // Helper: POST to Pinata; returns ipfsHash
  async function pinToPinata(base64: string, ext: string, pinataJwt: string): Promise<string> {
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
    // Construct FormData manually (for base64 + JWT support)
    const filename = `image.${ext}`;
    const formDataParts = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="file"; filename="${filename}"`,
      `Content-Type: image/${ext}`,
      "",
      atob(base64),
      `--${boundary}--`,
      "",
    ];
    const body = new Blob(formDataParts.map(part =>
      typeof part === "string" ? new TextEncoder().encode(part + "\r\n") : part
    ));
    const resp = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${pinataJwt}`,
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
        },
        body,
      }
    );
    if (!resp.ok) throw new Error("Pinata upload failed: " + await resp.text());
    const data = await resp.json();
    return data.IpfsHash as string;
  }

  // Handler for Mint & Fund button (calls OpenAI, binds fields)
  const handleMintAndFund = async () => {
    setOpenaiFields({});
    setError(null);
    setLoading(true);
    setIpfsHash(null);

    try {
      // 1. Call OpenAI Chat API, get metadata fields
      const fields = await fetchTokenMetadata(state.projectIdea);
      setOpenaiFields(fields);

      // 2. Call DALL·E 3 if modelChoice=OpenAI (we will assume so here)
      const openaiApiKey = ""; // <--- TODO: Supply your OpenAI API Key here
      if (!openaiApiKey) throw new Error("OpenAI API Key required");
      const imageUrl = await generateImageDalle3(fields.imagePrompt, openaiApiKey);

      // 3. Download image as base64
      const { base64, ext } = await fetchImageAsBase64(imageUrl);

      // 4. Pin to Pinata via pinFileToIPFS (needs Pinata JWT)
      if (!pinataJwt) throw new Error("Pinata JWT required (see below)");
      const hash = await pinToPinata(base64, ext, pinataJwt);
      setIpfsHash(hash);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return !state.isWizardOpen ? null : (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm transition">
      <div className="wizard-card w-[95vw] max-w-card mx-auto relative animate-fade-in shadow-lg">
        <button
          className="absolute top-3 right-4 text-body-text opacity-70 hover:opacity-100"
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>
        {/* Stepper */}
        <div className="flex justify-center mb-6">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className={`mx-1 w-6 h-2 rounded-full ${
                state.step === n 
                  ? "progress-bar"
                  : "bg-[#333]"
              }`}
            />
          ))}
        </div>
        {/* Step 1 */}
        {state.step === 1 && (
          <div>
            <h2 className="hero-title text-center">Describe Your Project Idea</h2>
            <textarea
              className="w-full mt-2 mb-7 min-h-[100px] resize-none"
              value={state.projectIdea}
              maxLength={256}
              onChange={e => setField("projectIdea", e.target.value)}
              placeholder="Three-track lo-fi EP…"
            />
            <AccentButton className="w-full mt-2" onClick={() => setStep(2)}>
              Next: Crew &amp; Cut →
            </AccentButton>
          </div>
        )}
        {/* Step 2 */}
        {state.step === 2 && (
          <WizardRolesStep
            roles={state.roles}
            editingRoleIdx={state.editingRoleIdx}
            projectType={state.projectType}
            setField={setField}
            loadDefaultRoles={loadDefaultRoles}
            saveRole={saveRole}
            removeRole={removeRole}
            setStep={setStep}
          />
        )}
        {/* Step 3 */}
        {state.step === 3 && (
          <div>
            <h2 className="headline text-center mb-2">Expenses &amp; Funding</h2>
            <div>
              {/* Expense Pills */}
              <div className="mb-2 flex flex-wrap gap-2">
                {[...upfrontExpenses, ...uponOutcomeExpenses].map((expense, i) => (
                  <ExpensePill
                    key={i}
                    expense={expense}
                    onEdit={() => {
                      setField("editingExpenseIdx", i);
                      setExpenseModalOpen(true);
                    }}
                    onDelete={() => removeExpense(i)}
                  />
                ))}
                <button
                  className="expense-pill bg-[#292929] text-accent border-accent hover:bg-accent/10 ml-1"
                  onClick={() => {
                    setField("editingExpenseIdx", null);
                    setExpenseModalOpen(true);
                  }}
                  aria-label="Add Expense"
                  type="button"
                >+ Add Expense</button>
              </div>
              <div className="text-body-text text-sm opacity-80 mb-2">
                <span className="font-semibold text-accent">{upfrontExpenses.length} Up Front</span> &middot;{" "}
                <span className="font-semibold text-yellow-500">{uponOutcomeExpenses.length} Upon Outcome</span>
              </div>
              <div className="text-body-text text-sm opacity-80 mb-2">
                Up front expenses: <span className="font-semibold text-accent">${expenseSum.toFixed(2)}</span><br/>
                Upon outcome: <span className="font-semibold text-yellow-500">${outcomeSum.toFixed(2)}</span>
              </div>
              <div className="text-body-text text-sm opacity-80 mb-2">
                You need <span className="font-semibold text-accent">${expenseSum.toFixed(2)}</span> USDC +{' '}
                {pledgeNum > 0 ? <>{pledgeNum} (pledge)</> : <>any extra for revenue splits</>}
              </div>
              <label className="block mt-5 mb-1 font-semibold text-body-text">
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
                className="w-full mb-1"
              />
              <div className="flex flex-col gap-3 mt-6">
                {/* PINATA JWT input (for MVP/testing) */}
                <input
                  type="password"
                  className="w-full text-xs border border-yellow-500 bg-neutral-900 rounded px-3 py-2 mb-3"
                  placeholder="Pinata JWT (Paste here for IPFS upload)"
                  value={pinataJwt}
                  onChange={e => setPinataJwt(e.target.value)}
                />
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
                  disabled={!state.walletAddress || loading}
                  onClick={handleMintAndFund}
                >
                  {loading ? "Calling OpenAI..." : "Mint & Fund"}
                </AccentButton>
                {error && (
                  <div className="mt-2 text-red-500 text-center text-xs">{error}</div>
                )}
                {Object.keys(openaiFields).length > 0 && (
                  <div className="mt-3 p-2 border border-green-600 bg-green-900/30 text-green-300 rounded text-xs font-mono space-y-1">
                    <div><b>Token Name:</b> {openaiFields.tokenName}</div>
                    <div><b>Symbol:</b> {openaiFields.tokenSymbol}</div>
                    <div><b>Supply:</b> {openaiFields.tokenSupply}</div>
                    <div><b>Image Prompt:</b> {openaiFields.imagePrompt}</div>
                    <div><b>Launch Copy:</b> {openaiFields.launchCopy}</div>
                  </div>
                )}
                {loading && (
                  <div className="text-yellow-400 text-xs text-center mt-2">Generating image & uploading&hellip;</div>
                )}
                {ipfsHash && (
                  <div className="mt-3 p-2 border border-cyan-700 bg-cyan-900/20 text-cyan-300 rounded text-xs font-mono ">
                    <b>IPFS Hash:</b> <span className="break-all">{ipfsHash}</span>
                    <div>
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                        target="_blank" rel="noopener noreferrer"
                        className="underline text-cyan-200 ml-2"
                      >
                        View image
                      </a>
                    </div>
                  </div>
                )}
                <AccentButton
                  secondary
                  className="w-full"
                  onClick={() => setStep(2)}
                >
                  ← Back
                </AccentButton>
              </div>
            </div>
            {/* Expense Modal */}
            <AddExpenseModal
              open={expenseModalOpen}
              defaultExpense={
                state.editingExpenseIdx !== null ? state.expenses[state.editingExpenseIdx] : undefined
              }
              onClose={() => setExpenseModalOpen(false)}
              onSave={exp => {
                // Use exp.payoutType from modal. Always set isFixed: true.
                saveExpense({ ...exp, isFixed: true }, state.editingExpenseIdx);
                setExpenseModalOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
