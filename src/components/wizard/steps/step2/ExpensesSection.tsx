
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Receipt } from "lucide-react";

interface Expense {
  name: string;
  amountUSDC: number;
  description: string;
}

interface ExpensesSectionProps {
  expenses: Expense[];
  onAddExpense: () => void;
  onEditExpense: (index: number) => void;
  onRemoveExpense: (index: number) => void;
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({
  expenses,
  onAddExpense,
  onEditExpense,
  onRemoveExpense,
}) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amountUSDC, 0);

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base flex items-center gap-2 font-inter">
          <Receipt className="w-4 h-4" />
          Project Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {expenses.length === 0 ? (
          <p className="text-sm text-tagline text-center py-4 font-inter">
            No expenses added yet. Add your project costs below.
          </p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-background border border-border rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm font-inter text-headline">{expense.name}</div>
                  <div className="text-xs text-tagline truncate font-inter">
                    {expense.description}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium font-inter text-headline">${expense.amountUSDC}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditExpense(index)}
                    className="h-8 px-2 font-inter"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveExpense(index)}
                    className="h-8 px-2 text-red-600 hover:text-red-700 font-inter"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            
            {totalExpenses > 0 && (
              <div className="text-sm font-medium text-accent bg-accent/10 p-2 rounded font-inter">
                Total Budget: ${totalExpenses.toLocaleString()}
              </div>
            )}
          </div>
        )}

        <Button
          variant="outline"
          onClick={onAddExpense}
          className="w-full gap-2 font-inter"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </Button>
      </CardContent>
    </Card>
  );
};
