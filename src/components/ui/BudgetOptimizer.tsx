
import React from "react";
import { Info, TrendingUp, AlertTriangle } from "lucide-react";
import type { Role, Expense, ProjectType } from "@/hooks/useWizardState";

type BudgetOptimizerProps = {
  roles: Role[];
  expenses: Expense[];
  projectType: ProjectType;
  pledgeAmount: number;
};

type Suggestion = {
  type: "warning" | "tip" | "benchmark";
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: string;
};

export const BudgetOptimizer: React.FC<BudgetOptimizerProps> = ({
  roles,
  expenses,
  projectType,
  pledgeAmount,
}) => {
  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const totalPercent = roles.reduce((sum, r) => sum + (r.percentNum || r.percent), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amountUSDC, 0);
    
    // Check percentage balance
    if (Math.abs(totalPercent - 100) > 0.1) {
      suggestions.push({
        type: "warning",
        icon: <AlertTriangle size={16} className="text-red-400" />,
        title: "Unbalanced Role Allocation",
        description: `Role percentages sum to ${totalPercent.toFixed(1)}%. Adjust to reach exactly 100%.`,
        action: "Auto-balance roles",
      });
    }

    // Project-specific suggestions
    switch (projectType) {
      case "Music":
        const artistRole = roles.find(r => r.roleName.toLowerCase().includes("artist"));
        if (artistRole && artistRole.percentNum < 40) {
          suggestions.push({
            type: "benchmark",
            icon: <TrendingUp size={16} className="text-blue-400" />,
            title: "Artist Share Benchmark",
            description: "In music projects, artists typically receive 40-60% of revenue share.",
            action: "Consider increasing artist percentage",
          });
        }
        break;
        
      case "Film":
        const directorRole = roles.find(r => r.roleName.toLowerCase().includes("director"));
        if (directorRole && directorRole.percentNum < 30) {
          suggestions.push({
            type: "benchmark",
            icon: <TrendingUp size={16} className="text-blue-400" />,
            title: "Director Share Benchmark",
            description: "Film directors typically receive 30-50% of creative revenue share.",
          });
        }
        break;
        
      case "Fashion":
        const designerRole = roles.find(r => r.roleName.toLowerCase().includes("designer"));
        if (designerRole && designerRole.percentNum < 50) {
          suggestions.push({
            type: "benchmark",
            icon: <TrendingUp size={16} className="text-blue-400" />,
            title: "Designer Share Benchmark",
            description: "Fashion designers typically retain 50-70% of creative revenue.",
          });
        }
        break;
    }

    // Budget optimization tips
    if (pledgeAmount > 0 && totalExpenses > pledgeAmount * 0.8) {
      suggestions.push({
        type: "tip",
        icon: <Info size={16} className="text-amber-400" />,
        title: "High Expense Ratio",
        description: "Expenses exceed 80% of pledge amount. Consider reducing upfront costs or increasing pledge.",
        action: "Review expense breakdown",
      });
    }

    if (roles.length > 6) {
      suggestions.push({
        type: "tip",
        icon: <Info size={16} className="text-amber-400" />,
        title: "Role Complexity",
        description: "Many roles can complicate revenue distribution. Consider consolidating similar roles.",
      });
    }

    // General tips
    if (suggestions.length === 0) {
      suggestions.push({
        type: "tip",
        icon: <TrendingUp size={16} className="text-green-400" />,
        title: "Well-Balanced Budget",
        description: "Your allocation looks good! Consider saving this as a scenario for future reference.",
      });
    }

    return suggestions;
  };

  const suggestions = generateSuggestions();

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-border space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <TrendingUp size={20} />
        Budget Optimization
      </h3>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              suggestion.type === "warning"
                ? "bg-red-500/10 border-red-500/20"
                : suggestion.type === "tip"
                ? "bg-amber-500/10 border-amber-500/20"
                : "bg-blue-500/10 border-blue-500/20"
            }`}
          >
            <div className="flex items-start gap-3">
              {suggestion.icon}
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                <p className="text-sm text-body-text/80 mb-2">{suggestion.description}</p>
                {suggestion.action && (
                  <button className="text-xs text-accent hover:text-accent/80 underline">
                    {suggestion.action}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
