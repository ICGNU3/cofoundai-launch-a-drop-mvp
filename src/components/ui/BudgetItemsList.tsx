
import React from "react";
import { BudgetItem, type BudgetItemType } from "./BudgetItem";
import type { Role, Expense, WizardStateData } from "@/hooks/useWizardState";

type BudgetItemsListProps = {
  roles: Role[];
  expenses: Expense[];
  pledgeUSDC: string;
  editingRoleIdx: number | null;
  editingExpenseIdx: number | null;
  onSaveExpense: (expense: Expense, index: number | null) => void;
  onRemoveExpense: (index: number) => void;
  onSetField: <K extends keyof WizardStateData>(key: K, value: WizardStateData[K]) => void;
  onUpdateRolePercent: (idx: number, newPercent: number) => void;
};

export const BudgetItemsList: React.FC<BudgetItemsListProps> = ({
  roles,
  expenses,
  pledgeUSDC,
  editingRoleIdx,
  editingExpenseIdx,
  onSaveExpense,
  onRemoveExpense,
  onSetField,
  onUpdateRolePercent,
}) => {
  const handleEditRole = (index: number) => {
    onSetField("editingRoleIdx", index);
  };

  const handleEditExpense = (index: number) => {
    onSetField("editingExpenseIdx", index);
  };

  const handleDeleteRole = (index: number) => {
    // This should be handled by the parent component
    console.log("Delete role:", index);
  };

  const handleDeleteExpense = (index: number) => {
    onRemoveExpense(index);
  };

  // Create unified budget items list
  const budgetItems: BudgetItemType[] = [
    ...roles.map(role => ({ ...role, type: "share" as const })),
    ...expenses.map(expense => ({ ...expense, type: "fixed" as const }))
  ];

  return (
    <div className="space-y-2 min-h-[200px]">
      {budgetItems.map((item, index) => {
        const isRole = item.type === "share";
        const originalIndex = isRole 
          ? roles.findIndex(r => r.roleName === item.roleName && r.walletAddress === item.walletAddress)
          : expenses.findIndex(e => e.expenseName === item.expenseName);
        
        return (
          <div
            key={`${item.type}-${index}`}
            className="animate-fade-in"
          >
            <BudgetItem
              item={item}
              onEdit={() => isRole ? handleEditRole(originalIndex) : handleEditExpense(originalIndex)}
              onDelete={() => isRole ? handleDeleteRole(originalIndex) : handleDeleteExpense(originalIndex)}
              onPercentChange={isRole ? (newPercent) => onUpdateRolePercent(originalIndex, newPercent) : undefined}
            />
          </div>
        );
      })}
      
      {budgetItems.length === 0 && (
        <div className="text-center py-8 text-body-text/60">
          No budget items yet. Add your first line item below.
        </div>
      )}
    </div>
  );
};
