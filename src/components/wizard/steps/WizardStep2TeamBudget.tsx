
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
    <div className="p-6 space-y-6">
      {/* Team Roles Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Team Roles & Revenue Split
            {errors.roles && <AlertCircle className="w-4 h-4 text-red-500" />}
            {!errors.roles && totalRolePercent === 100 && state.roles.length > 0 && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.roles.map((role, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <Input
                placeholder="Role name"
                value={role.name}
                onChange={(e) => updateRole(index, { name: e.target.value })}
                className={`flex-1 ${!role.name.trim() && errors.roles ? 'border-red-500' : ''}`}
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
                  className={`w-20 ${role.percent <= 0 && errors.roles ? 'border-red-500' : ''}`}
                  min="0"
                  max="100"
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
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-2 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.roles}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget & Expenses Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Project Budget
            {errors.expenses && <AlertCircle className="w-4 h-4 text-red-500" />}
            {!errors.expenses && state.expenses.length > 0 && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.expenses.map((expense, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <Input
                placeholder="Expense name"
                value={expense.name}
                onChange={(e) => updateExpense(index, { name: e.target.value })}
                className={`flex-1 ${!expense.name.trim() && errors.expenses ? 'border-red-500' : ''}`}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-text/60">$</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={expense.amountUSDC}
                  onChange={(e) => updateExpense(index, { amountUSDC: parseInt(e.target.value) || 0 })}
                  className={`w-24 ${expense.amountUSDC <= 0 && errors.expenses ? 'border-red-500' : ''}`}
                  min="1"
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
            Add Expense
          </Button>
          
          <div className="text-sm text-center">
            Total Budget: <span className="font-medium">${totalExpenses.toLocaleString()}</span>
          </div>
          
          {errors.expenses && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-2 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.expenses}
            </div>
          )}
        </CardContent>
      </Card>

      {/* USDC Pledge */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Initial Pledge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text/60">$</span>
            <Input
              type="number"
              placeholder="0"
              value={state.pledgeUSDC}
              onChange={(e) => handlePledgeChange(e.target.value)}
              className={`flex-1 ${errors.pledge ? 'border-red-500' : ''}`}
              min="0"
              max="100000"
            />
            <span className="text-sm text-text/60">USDC</span>
          </div>
          <p className="text-xs text-text/60 mt-2">
            This is your initial contribution to get the project started
          </p>
          {errors.pledge && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-2 rounded mt-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.pledge}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-accent text-black hover:bg-accent/90 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Launch
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
