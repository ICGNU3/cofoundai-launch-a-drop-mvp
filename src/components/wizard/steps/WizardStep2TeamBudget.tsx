
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Plus, X, CheckCircle, AlertCircle, Info, Users, DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { StreamlinedWizardState, Role, Expense } from "@/hooks/wizard/useStreamlinedWizard";

interface WizardStep2TeamBudgetProps {
  state: StreamlinedWizardState;
  updateField: <K extends keyof StreamlinedWizardState>(field: K, value: StreamlinedWizardState[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const WizardStep2TeamBudget: React.FC<WizardStep2TeamBudgetProps> = ({
  state,
  updateField,
  nextStep,
  prevStep,
}) => {
  const totalRolePercent = state.roles.reduce((sum, role) => sum + role.percent, 0);
  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amountUSDC, 0);
  const pledgeAmount = parseInt(state.pledgeUSDC) || 0;
  
  const canProceed = totalRolePercent === 100 && state.expenses.length > 0;
  const hasValidRoles = state.mode === "solo" || (state.mode === "team" && state.roles.length > 0);

  const addRole = () => {
    const newRole: Role = {
      name: "",
      percent: 0,
      percentNum: 0,
      percentStr: "0",
      address: "",
      isFixed: false,
    };
    updateField("roles", [...state.roles, newRole]);
  };

  const updateRole = (index: number, updates: Partial<Role>) => {
    const updatedRoles = state.roles.map((role, i) => 
      i === index ? { ...role, ...updates } : role
    );
    updateField("roles", updatedRoles);
  };

  const removeRole = (index: number) => {
    const updatedRoles = state.roles.filter((_, i) => i !== index);
    updateField("roles", updatedRoles);
  };

  const addExpense = () => {
    const newExpense: Expense = {
      name: "",
      amountUSDC: 0,
      description: "",
    };
    updateField("expenses", [...state.expenses, newExpense]);
  };

  const updateExpense = (index: number, updates: Partial<Expense>) => {
    const updatedExpenses = state.expenses.map((expense, i) => 
      i === index ? { ...expense, ...updates } : expense
    );
    updateField("expenses", updatedExpenses);
  };

  const removeExpense = (index: number) => {
    const updatedExpenses = state.expenses.filter((_, i) => i !== index);
    updateField("expenses", updatedExpenses);
  };

  const addDefaultExpenses = () => {
    const defaultExpenses = [
      { name: "Production Costs", amountUSDC: 1000, description: "Equipment, materials, and production expenses" },
      { name: "Marketing", amountUSDC: 500, description: "Promotion and outreach activities" },
      { name: "Platform Fees", amountUSDC: 100, description: "Platform and transaction fees" },
    ];
    updateField("expenses", defaultExpenses);
  };

  const getRoleValidationStatus = () => {
    if (state.mode === "solo") return { type: "success", message: "Solo mode - 100% revenue to you" };
    if (state.roles.length === 0) return { type: "error", message: "Add at least one team member" };
    if (totalRolePercent < 100) return { type: "warning", message: `${100 - totalRolePercent}% remaining to allocate` };
    if (totalRolePercent > 100) return { type: "error", message: `Over by ${totalRolePercent - 100}%` };
    return { type: "success", message: "Perfect! Revenue split totals 100%" };
  };

  const getExpenseStatus = () => {
    if (state.expenses.length === 0) return { type: "error", message: "Add at least one budget item" };
    if (totalExpenses === 0) return { type: "warning", message: "Consider adding budget amounts" };
    return { type: "success", message: `Total budget: $${totalExpenses.toLocaleString()}` };
  };

  const roleStatus = getRoleValidationStatus();
  const expenseStatus = getExpenseStatus();

  return (
    <div className="flex flex-col h-full">
      {/* Progress Indicator */}
      <div className="flex-shrink-0 px-6 pt-4">
        <div className="flex items-center gap-2 text-sm text-accent">
          <div className="w-2 h-2 bg-accent rounded-full"></div>
          <span>Step 2 of 3: Team & Budget Setup</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Team Roles Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Roles & Revenue Split
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status indicator */}
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              roleStatus.type === "success" ? "bg-green-50 border-green-200" :
              roleStatus.type === "warning" ? "bg-yellow-50 border-yellow-200" :
              "bg-red-50 border-red-200"
            } border`}>
              {roleStatus.type === "success" && <CheckCircle className="w-4 h-4 text-green-600" />}
              {roleStatus.type !== "success" && <AlertCircle className="w-4 h-4 text-yellow-600" />}
              <span className={`text-sm ${
                roleStatus.type === "success" ? "text-green-700" :
                roleStatus.type === "warning" ? "text-yellow-700" :
                "text-red-700"
              }`}>
                {roleStatus.message}
              </span>
            </div>

            {state.mode === "team" && (
              <>
                {state.roles.map((role, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <Input
                      placeholder="Role name (e.g., Director, Producer)"
                      value={role.name}
                      onChange={(e) => updateRole(index, { name: e.target.value })}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={role.percentStr}
                        onChange={(e) => {
                          const value = e.target.value;
                          const num = parseInt(value) || 0;
                          updateRole(index, { 
                            percentStr: value,
                            percentNum: num,
                            percent: num 
                          });
                        }}
                        className="w-20"
                      />
                      <span className="text-sm text-text/60">%</span>
                    </div>
                    {!role.isFixed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRole(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button variant="outline" onClick={addRole} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </>
            )}

            {state.mode === "solo" && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Solo mode selected - You'll receive 100% of revenue by default. 
                  You can always add collaborators later.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Budget & Expenses Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Project Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status indicator */}
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              expenseStatus.type === "success" ? "bg-green-50 border-green-200" :
              expenseStatus.type === "warning" ? "bg-yellow-50 border-yellow-200" :
              "bg-red-50 border-red-200"
            } border`}>
              {expenseStatus.type === "success" && <CheckCircle className="w-4 h-4 text-green-600" />}
              {expenseStatus.type !== "success" && <AlertCircle className="w-4 h-4 text-yellow-600" />}
              <span className={`text-sm ${
                expenseStatus.type === "success" ? "text-green-700" :
                expenseStatus.type === "warning" ? "text-yellow-700" :
                "text-red-700"
              }`}>
                {expenseStatus.message}
              </span>
            </div>

            {state.expenses.length === 0 && (
              <div className="text-center py-4">
                <Button onClick={addDefaultExpenses} variant="outline" className="mb-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Common Budget Items
                </Button>
                <p className="text-xs text-text/60">Or add custom items below</p>
              </div>
            )}

            {state.expenses.map((expense, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <Input
                  placeholder="Expense name (e.g., Equipment, Marketing)"
                  value={expense.name}
                  onChange={(e) => updateExpense(index, { name: e.target.value })}
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text/60">$</span>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={expense.amountUSDC || ""}
                    onChange={(e) => updateExpense(index, { amountUSDC: parseInt(e.target.value) || 0 })}
                    className="w-24"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExpense(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            <Button variant="outline" onClick={addExpense} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Budget Item
            </Button>
          </CardContent>
        </Card>

        {/* USDC Pledge */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Initial Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text/60">$</span>
              <Input
                type="number"
                placeholder="0"
                min="0"
                value={state.pledgeUSDC}
                onChange={(e) => updateField("pledgeUSDC", e.target.value)}
                className="flex-1"
              />
              <span className="text-sm text-text/60">USDC</span>
            </div>
            <div className="mt-3 p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-text/60">
                This shows your commitment and helps kickstart the project. 
                {pledgeAmount > 0 && ` That's ${((pledgeAmount / totalExpenses) * 100).toFixed(1)}% of your total budget.`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {canProceed && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Ready to proceed!</strong> Your team structure and budget are properly configured.
              You can always adjust these later if needed.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Fixed Navigation */}
      <div className="flex-shrink-0 border-t border-border p-6">
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={nextStep}
            disabled={!canProceed}
            className="bg-accent text-black hover:bg-accent/90 gap-2 min-w-[200px]"
          >
            Continue to Launch
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
