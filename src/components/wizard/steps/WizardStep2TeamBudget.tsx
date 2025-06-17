
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Plus, X, AlertCircle, CheckCircle } from "lucide-react";
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
  const [errors, setErrors] = React.useState<{
    roles?: string;
    expenses?: string;
    pledge?: string;
  }>({});

  const totalRolePercent = state.roles.reduce((sum, role) => sum + role.percent, 0);
  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amountUSDC, 0);
  
  const validateRoles = () => {
    if (state.roles.length === 0) {
      return "At least one team member is required";
    }
    if (state.roles.some(role => !role.name.trim())) {
      return "All team members must have a name";
    }
    if (totalRolePercent !== 100) {
      return "Team roles must total exactly 100%";
    }
    if (state.roles.some(role => role.percent <= 0)) {
      return "All team members must have a percentage greater than 0%";
    }
    return null;
  };

  const validateExpenses = () => {
    if (state.expenses.length === 0) {
      return "At least one budget item is required";
    }
    if (state.expenses.some(expense => !expense.name.trim())) {
      return "All budget items must have a name";
    }
    if (state.expenses.some(expense => expense.amountUSDC <= 0)) {
      return "All budget amounts must be greater than $0";
    }
    if (totalExpenses > 1000000) {
      return "Total budget cannot exceed $1,000,000";
    }
    return null;
  };

  const validatePledge = () => {
    const pledgeNum = parseFloat(state.pledgeUSDC) || 0;
    if (pledgeNum < 0) {
      return "Pledge amount cannot be negative";
    }
    if (pledgeNum > 100000) {
      return "Pledge amount cannot exceed $100,000";
    }
    return null;
  };

  const handleNext = () => {
    const roleError = validateRoles();
    const expenseError = validateExpenses();
    const pledgeError = validatePledge();
    
    const newErrors = {
      roles: roleError || undefined,
      expenses: expenseError || undefined,
      pledge: pledgeError || undefined,
    };
    
    setErrors(newErrors);
    
    if (!roleError && !expenseError && !pledgeError) {
      nextStep();
    }
  };

  const canProceed = totalRolePercent === 100 && 
                    state.expenses.length > 0 && 
                    state.roles.length > 0 &&
                    !errors.roles && !errors.expenses && !errors.pledge;

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
    
    // Clear role errors when user makes changes
    if (errors.roles) {
      setErrors(prev => ({ ...prev, roles: undefined }));
    }
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
    
    // Clear expense errors when user makes changes
    if (errors.expenses) {
      setErrors(prev => ({ ...prev, expenses: undefined }));
    }
  };

  const removeExpense = (index: number) => {
    const updatedExpenses = state.expenses.filter((_, i) => i !== index);
    updateField("expenses", updatedExpenses);
  };

  const handlePledgeChange = (value: string) => {
    updateField("pledgeUSDC", value);
    if (errors.pledge) {
      setErrors(prev => ({ ...prev, pledge: undefined }));
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Team Roles Section */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base flex items-center gap-2 flex-wrap">
            <span>Team Roles & Revenue Split</span>
            {errors.roles && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
            {!errors.roles && totalRolePercent === 100 && state.roles.length > 0 && (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 pt-0">
          {state.roles.map((role, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 border border-border rounded-lg">
              <Input
                placeholder="Role name"
                value={role.name}
                onChange={(e) => updateRole(index, { name: e.target.value })}
                className={`flex-1 min-h-[44px] ${!role.name.trim() && errors.roles ? 'border-red-500' : ''}`}
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="0"
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
                  className={`w-20 sm:w-20 min-h-[44px] ${role.percent <= 0 && errors.roles ? 'border-red-500' : ''}`}
                  min="0"
                  max="100"
                />
                <span className="text-sm text-text/60 flex-shrink-0">%</span>
              </div>
              {!role.isFixed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRole(index)}
                  className="text-red-500 hover:text-red-600 min-h-[44px] min-w-[44px] flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button variant="outline" onClick={addRole} className="w-full min-h-[44px]">
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
          
          <div className="text-sm text-center">
            <span className={totalRolePercent === 100 ? "text-green-600" : "text-text"}>
              Total: {totalRolePercent}%
            </span>
            {totalRolePercent !== 100 && (
              <span className="text-red-500 ml-2">
                (Must equal 100%)
              </span>
            )}
          </div>
          
          {errors.roles && (
            <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 p-3 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="break-words">{errors.roles}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget & Expenses Section */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base flex items-center gap-2 flex-wrap">
            <span>Project Budget</span>
            {errors.expenses && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
            {!errors.expenses && state.expenses.length > 0 && (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 pt-0">
          {state.expenses.map((expense, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 border border-border rounded-lg">
              <Input
                placeholder="Expense name"
                value={expense.name}
                onChange={(e) => updateExpense(index, { name: e.target.value })}
                className={`flex-1 min-h-[44px] ${!expense.name.trim() && errors.expenses ? 'border-red-500' : ''}`}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-text/60 flex-shrink-0">$</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={expense.amountUSDC}
                  onChange={(e) => updateExpense(index, { amountUSDC: parseInt(e.target.value) || 0 })}
                  className={`w-24 sm:w-24 min-h-[44px] ${expense.amountUSDC <= 0 && errors.expenses ? 'border-red-500' : ''}`}
                  min="1"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExpense(index)}
                className="text-red-500 hover:text-red-600 min-h-[44px] min-w-[44px] flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <Button variant="outline" onClick={addExpense} className="w-full min-h-[44px]">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
          
          <div className="text-sm text-center">
            Total Budget: <span className="font-medium">${totalExpenses.toLocaleString()}</span>
          </div>
          
          {errors.expenses && (
            <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 p-3 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="break-words">{errors.expenses}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* USDC Pledge */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base">Your Initial Pledge</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text/60 flex-shrink-0">$</span>
            <Input
              type="number"
              placeholder="0"
              value={state.pledgeUSDC}
              onChange={(e) => handlePledgeChange(e.target.value)}
              className={`flex-1 min-h-[44px] ${errors.pledge ? 'border-red-500' : ''}`}
              min="0"
              max="100000"
            />
            <span className="text-sm text-text/60 flex-shrink-0">USDC</span>
          </div>
          <p className="text-xs text-text/60 mt-2">
            This is your initial contribution to get the project started
          </p>
          {errors.pledge && (
            <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 p-3 rounded mt-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="break-words">{errors.pledge}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          className="gap-2 min-h-[44px] order-2 sm:order-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-accent text-black hover:bg-accent/90 gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] order-1 sm:order-2"
        >
          <span className="hidden sm:inline">Continue to Launch</span>
          <span className="sm:hidden">Continue</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
