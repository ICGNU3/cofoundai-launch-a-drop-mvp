
import React, { useState } from "react";
import { AccentButton } from "./AccentButton";
import { Plus, Copy, Trash2, BarChart3 } from "lucide-react";
import type { Role, Expense, ProjectType } from "@/hooks/useWizardState";

type Scenario = {
  id: string;
  name: string;
  roles: Role[];
  expenses: Expense[];
  pledgeUSDC: string;
  createdAt: Date;
};

type ScenarioPlannerProps = {
  currentRoles: Role[];
  currentExpenses: Expense[];
  currentPledge: string;
  projectType: ProjectType;
  onLoadScenario: (scenario: Scenario) => void;
};

export const ScenarioPlanner: React.FC<ScenarioPlannerProps> = ({
  currentRoles,
  currentExpenses,
  currentPledge,
  projectType,
  onLoadScenario,
}) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState("");

  const saveCurrentAsScenario = () => {
    if (!newScenarioName.trim()) return;

    const newScenario: Scenario = {
      id: Math.random().toString(36).substr(2, 9),
      name: newScenarioName,
      roles: JSON.parse(JSON.stringify(currentRoles)),
      expenses: JSON.parse(JSON.stringify(currentExpenses)),
      pledgeUSDC: currentPledge,
      createdAt: new Date(),
    };

    setScenarios(prev => [...prev, newScenario]);
    setNewScenarioName("");
  };

  const duplicateScenario = (scenario: Scenario) => {
    const duplicate: Scenario = {
      ...scenario,
      id: Math.random().toString(36).substr(2, 9),
      name: `${scenario.name} (Copy)`,
      createdAt: new Date(),
    };
    setScenarios(prev => [...prev, duplicate]);
  };

  const deleteScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  };

  const getScenarioSummary = (scenario: Scenario) => {
    const totalPercent = scenario.roles.reduce((sum, r) => sum + (r.percentNum || r.percent), 0);
    const totalExpenses = scenario.expenses.reduce((sum, e) => sum + e.amountUSDC, 0);
    const pledgeAmount = Number(scenario.pledgeUSDC) || 0;
    
    return {
      isBalanced: Math.abs(totalPercent - 100) < 0.1,
      totalExpenses,
      pledgeAmount,
      totalBudget: totalExpenses + pledgeAmount,
    };
  };

  if (!isExpanded) {
    return (
      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-border">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 w-full text-left hover:text-accent transition-colors"
        >
          <BarChart3 size={20} />
          <span className="font-medium">Scenario Planning</span>
          <span className="text-sm text-body-text/60 ml-auto">
            {scenarios.length} scenarios saved
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 size={20} />
          Scenario Planning
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-body-text/60 hover:text-body-text transition-colors"
        >
          ×
        </button>
      </div>

      {/* Save Current Scenario */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter scenario name..."
          value={newScenarioName}
          onChange={(e) => setNewScenarioName(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#232323] border border-border rounded text-sm"
          onKeyDown={(e) => e.key === 'Enter' && saveCurrentAsScenario()}
        />
        <AccentButton
          secondary
          onClick={saveCurrentAsScenario}
          disabled={!newScenarioName.trim()}
          className="px-4"
        >
          <Plus size={16} />
          Save
        </AccentButton>
      </div>

      {/* Scenarios List */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {scenarios.length === 0 ? (
          <div className="text-center py-8 text-body-text/60">
            No scenarios saved yet. Save your current allocation to compare different options.
          </div>
        ) : (
          scenarios.map((scenario) => {
            const summary = getScenarioSummary(scenario);
            return (
              <div
                key={scenario.id}
                className="bg-[#232323] p-4 rounded border border-border/50 hover:border-border transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{scenario.name}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onLoadScenario(scenario)}
                      className="text-accent hover:text-accent/80 text-sm px-2 py-1 rounded"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => duplicateScenario(scenario)}
                      className="text-body-text/60 hover:text-body-text p-1 rounded"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => deleteScenario(scenario.id)}
                      className="text-red-400 hover:text-red-300 p-1 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-body-text/80 space-y-1">
                  <div className="flex justify-between">
                    <span>Roles:</span>
                    <span className={summary.isBalanced ? "text-green-400" : "text-red-400"}>
                      {scenario.roles.length} roles {summary.isBalanced ? "✓" : "⚠"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget:</span>
                    <span>${summary.totalBudget.toLocaleString()} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{scenario.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
