
import React from "react";

interface DropSummarySectionProps {
  projectIdea: string;
  roles: any[];
  expenses: any[];
  coverBase64?: string | null;
}

export const DropSummarySection: React.FC<DropSummarySectionProps> = ({
  projectIdea,
  roles,
  expenses,
  coverBase64,
}) => (
  <div className="space-y-2 mb-4">
    <div className="text-lg font-bold font-headline mb-2">Drop Summary</div>
    <div className="mb-1">
      <span className="font-semibold">Idea:</span> {projectIdea}
    </div>
    <div className="mb-1">
      <span className="font-semibold">Roles:</span>{" "}
      {roles?.map((r: any) => r.label || r.title || r.name).join(", ")}
    </div>
    <div className="mb-1">
      <span className="font-semibold">Expenses:</span>{" "}
      {expenses?.length
        ? expenses.map((e: any) => `${e.label || e.title}: $${e.amountUSDC}`).join("; ")
        : "None"}
    </div>
    {coverBase64 && (
      <div className="mt-2 flex items-center gap-2">
        <span className="font-semibold">Cover Art:</span>
        <img src={coverBase64} alt="Cover Preview" className="w-12 h-12 rounded border" />
      </div>
    )}
  </div>
);
