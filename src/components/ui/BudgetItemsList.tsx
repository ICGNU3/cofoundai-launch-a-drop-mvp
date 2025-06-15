
import React from "react";
import { BudgetItem, type BudgetItemType } from "./BudgetItem";
import type { Role, Expense } from "@/hooks/useWizardState";

type BudgetItemsListProps = {
  roles: Role[];
  expenses: Expense[];
  onEditRole: (index: number) => void;
  onEditExpense: (index: number) => void;
  onDeleteRole: (index: number) => void;
  onDeleteExpense: (index: number) => void;
  onUpdateRolePercent?: (idx: number, newPercent: number) => void;
};

export const BudgetItemsList: React.FC<BudgetItemsListProps> = ({
  roles,
  expenses,
  onEditRole,
  onEditExpense,
  onDeleteRole,
  onDeleteExpense,
  onUpdateRolePercent,
}) => {
  // Create unified budget items list
  const budgetItems: BudgetItemType[] = [
    ...roles.map(role => ({ ...role, type: "share" as const })),
    ...expenses.map(expense => ({ ...expense, type: "fixed" as const }))
  ];

  const handleEditItem = (index: number, type: "role" | "expense") => {
    if (type === "role") {
      const roleIndex = roles.findIndex(r => 
        r.roleName === budgetItems[index].roleName && 
        r.walletAddress === budgetItems[index].walletAddress
      );
      onEditRole(roleIndex);
    } else {
      const expenseIndex = expenses.findIndex(e => 
        e.expenseName === budgetItems[index].expenseName
      );
      onEditExpense(expenseIndex);
    }
  };

  const handleDeleteItem = (index: number, type: "role" | "expense") => {
    if (type === "role") {
      const roleIndex = roles.findIndex(r => 
        r.roleName === budgetItems[index].roleName && 
        r.walletAddress === budgetItems[index].walletAddress
      );
      onDeleteRole(roleIndex);
    } else {
      const expenseIndex = expenses.findIndex(e => 
        e.expenseName === budgetItems[index].expenseName
      );
      onDeleteExpense(expenseIndex);
    }
  };

  return (
    <div className="space-y-2 min-h-[200px]">
      {budgetItems.map((item, index) => {
        const isRole = item.type === "share";
        const roleIndex = isRole ? roles.findIndex(r => r.roleName === item.roleName && r.walletAddress === item.walletAddress) : -1;
        
        return (
          <div
            key={`${item.type}-${index}`}
            className="animate-fade-in"
          >
            <BudgetItem
              item={item}
              onEdit={() => handleEditItem(index, isRole ? "role" : "expense")}
              onDelete={() => handleDeleteItem(index, isRole ? "role" : "expense")}
              onPercentChange={isRole && onUpdateRolePercent ? (newPercent) => onUpdateRolePercent(roleIndex, newPercent) : undefined}
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
