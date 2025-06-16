
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Plus, X } from "lucide-react";
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";

interface Role {
  name: string;
  percent: number;
  percentNum: number;
  percentStr: string;
  address: string;
  isFixed: boolean;
}

interface Expense {
  name: string;
  amountUSDC: number;
  description: string;
}

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
  
  const canProceed = totalRolePercent === 100 && state.expenses.length > 0;

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

  return (
    <div className="p-6 space-y-6">
      {/* Team Roles Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team Roles & Revenue Split</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.roles.map((role, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <Input
                placeholder="Role name"
                value={role.name}
                onChange={(e) => updateRole(index, { name: e.target.value })}
                className="flex-1"
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
          
          <div className="text-sm text-center">
            Total: {totalRolePercent}% 
            {totalRolePercent !== 100 && (
              <span className="text-red-500 ml-2">
                (Must equal 100%)
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Budget & Expenses Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.expenses.map((expense, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <Input
                placeholder="Expense name"
                value={expense.name}
                onChange={(e) => updateExpense(index, { name: e.target.value })}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-text/60">$</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={expense.amountUSDC}
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
            Add Expense
          </Button>
          
          <div className="text-sm text-center">
            Total Budget: ${totalExpenses.toLocaleString()}
          </div>
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
              onChange={(e) => updateField("pledgeUSDC", e.target.value)}
              className="flex-1"
            />
            <span className="text-sm text-text/60">USDC</span>
          </div>
          <p className="text-xs text-text/60 mt-2">
            This is your initial contribution to get the project started
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={!canProceed}
          className="bg-accent text-black hover:bg-accent/90 gap-2"
        >
          Continue to Launch
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
