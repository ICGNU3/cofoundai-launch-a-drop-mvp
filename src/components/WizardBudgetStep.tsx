
import React, { useState } from "react";
import { AccentButton } from "./ui/AccentButton";
import { BudgetItem, type BudgetItemType } from "./ui/BudgetItem";
import { AddBudgetItemForm } from "./ui/AddBudgetItemForm";
import { AddRoleModal } from "./ui/AddRoleModal";
import { AddExpenseModal } from "./ui/AddExpenseModal";
import { PercentBar } from "./ui/PercentBar";
import type { Role, Expense, ProjectType } from "@/hooks/useWizardState";
import { useRoleTemplates } from "@/hooks/useRoleTemplates";
import { useToast } from "@/hooks/use-toast";

const projectTypes: ProjectType[] = ["Music", "Film", "Fashion", "Art", "Other"];

type WizardBudgetStepProps = {
  roles: Role[];
  expenses: Expense[];
  editingRoleIdx: number | null;
  editingExpenseIdx: number | null;
  projectType: ProjectType;
  setField: (field: keyof any, value: any) => void;
  loadDefaultRoles: (type: ProjectType) => void;
  saveRole: (role: Role, idx: number | null) => void;
  removeRole: (idx: number) => void;
  updateRolePercent?: (idx: number, newPercent: number) => void;
  saveExpense: (expense: Expense, idx: number | null) => void;
  removeExpense: (idx: number) => void;
  setStep: (s: 1 | 2 | 3) => void;
};

export const WizardBudgetStep: React.FC<WizardBudgetStepProps> = ({
  roles,
  expenses,
  editingRoleIdx,
  editingExpenseIdx,
  projectType,
  setField,
  loadDefaultRoles,
  saveRole,
  removeRole,
  updateRolePercent,
  saveExpense,
  removeExpense,
  setStep,
}) => {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<"role" | "expense" | null>(null);

  const templatesCtx = useRoleTemplates();
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const { toast } = useToast();

  // Create unified budget items list
  const budgetItems: BudgetItemType[] = [
    ...roles.map(role => ({ ...role, type: "share" as const })),
    ...expenses.map(expense => ({ ...expense, type: "fixed" as const }))
  ];

  // Percent validation
  const sumPercent = roles.reduce((sum, r) => sum + (r.percentNum || r.percent), 0);
  const percentColor = sumPercent === 100 ? "text-green-400" : "text-red-500";
  const percentMsg = sumPercent < 100 && expenses.length === 0
    ? `Need ${100 - sumPercent}% more` 
    : sumPercent > 100 
    ? `Remove ${sumPercent - 100}%` 
    : sumPercent === 100
    ? "Percentages balanced ✓"
    : `${100 - sumPercent}% remaining`;

  // Auto-rebalance percentages when adding new role
  const handleAddRole = (newRole: Role) => {
    const roleWithPercent = {
      ...newRole,
      percentNum: newRole.percent || 10,
      percentStr: (newRole.percent || 10).toString()
    };
    
    saveRole(roleWithPercent, null);
  };

  const handleEditItem = (index: number, type: "role" | "expense") => {
    if (type === "role") {
      setField("editingRoleIdx", index);
      setEditingType("role");
      setRoleModalOpen(true);
    } else {
      setField("editingExpenseIdx", index);
      setEditingType("expense");
      setExpenseModalOpen(true);
    }
  };

  const handleDeleteItem = (index: number, type: "role" | "expense") => {
    if (type === "role") {
      removeRole(index);
    } else {
      removeExpense(index);
    }
  };

  // Template functions
  const handleSaveTemplate = () => {
    if (newTemplateName.trim()) {
      templatesCtx.saveTemplate(newTemplateName.trim(), roles);
      setNewTemplateName("");
      setShowTemplateMenu(false);
      toast({
        title: "Template Saved",
        description: `Saved template '${newTemplateName.trim()}'`,
      });
    }
  };

  const handleLoadTemplate = (templateName: string) => {
    const tplRoles = templatesCtx.loadTemplate(templateName);
    if (tplRoles) {
      setField("roles", tplRoles.map(r => ({ ...r })));
      setShowTemplateMenu(false);
      toast({
        title: "Template Loaded",
        description: `Loaded template '${templateName}'`,
      });
    }
  };

  const handleDeleteTemplate = (templateName: string) => {
    templatesCtx.deleteTemplate(templateName);
    toast({
      title: "Template Deleted",
      description: `Deleted template '${templateName}'`,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="headline text-center mb-4">Budget Breakdown</h2>
      
      {/* Project Type Selection */}
      <div>
        <label className="block mb-2 text-body-text font-semibold">Project Type</label>
        <select
          className="w-full mb-2"
          value={projectType}
          onChange={e => {
            setField("projectType", e.target.value as ProjectType);
            loadDefaultRoles(e.target.value as ProjectType);
          }}
        >
          {projectTypes.map(type => (
            <option value={type} key={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Role Templates */}
      <div className="mb-4">
        <button
          type="button"
          className="text-xs border px-2 py-1 rounded bg-[#181818] border-[#343439] text-accent hover:bg-[#232323] transition"
          onClick={() => setShowTemplateMenu(v => !v)}
        >
          {showTemplateMenu ? "Hide Templates" : "Role Templates"}
        </button>
        {showTemplateMenu && (
          <div className="rounded border border-border bg-card p-3 text-xs mt-2 space-y-3">
            <div>
              <div className="font-semibold mb-2">Save Current as Template</div>
              <div className="flex gap-2">
                <input
                  placeholder="Template Name"
                  className="p-2 border border-border rounded bg-[#232323] text-xs flex-1"
                  value={newTemplateName}
                  onChange={e => setNewTemplateName(e.target.value)}
                  maxLength={32}
                />
                <button
                  className="text-xs px-3 py-2 bg-accent/80 text-background rounded hover:bg-accent"
                  onClick={handleSaveTemplate}
                  disabled={!newTemplateName.trim()}
                >
                  Save
                </button>
              </div>
            </div>
            {templatesCtx.templates.length > 0 && (
              <div>
                <div className="font-semibold mb-2">Load Template</div>
                <ul className="space-y-1">
                  {templatesCtx.templates.map(tpl => (
                    <li key={tpl.name} className="flex items-center gap-2">
                      <button
                        className="text-accent hover:underline text-sm px-1"
                        onClick={() => handleLoadTemplate(tpl.name)}
                        type="button"
                      >
                        {tpl.name}
                      </button>
                      <button
                        className="text-xs text-red-400 border rounded px-1 py-0.5 border-border hover:bg-red-400/20"
                        onClick={() => handleDeleteTemplate(tpl.name)}
                        type="button"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <PercentBar used={sumPercent} />
      <div className={`text-sm font-semibold ${percentColor} mb-4`}>
        {percentMsg}
      </div>

      {/* Budget Items List */}
      <div className="space-y-2 min-h-[200px]">
        {budgetItems.map((item, index) => {
          const isRole = item.type === "share";
          const roleIndex = isRole ? roles.findIndex(r => r.roleName === item.roleName && r.walletAddress === item.walletAddress) : -1;
          const expenseIndex = !isRole ? expenses.findIndex(e => e.expenseName === item.expenseName) : -1;
          
          return (
            <div
              key={`${item.type}-${index}`}
              className="animate-fade-in"
            >
              <BudgetItem
                item={item}
                onEdit={() => handleEditItem(
                  isRole ? roleIndex : expenseIndex,
                  isRole ? "role" : "expense"
                )}
                onDelete={() => handleDeleteItem(
                  isRole ? roleIndex : expenseIndex,
                  isRole ? "role" : "expense"
                )}
                onPercentChange={isRole && updateRolePercent ? (newPercent) => updateRolePercent(roleIndex, newPercent) : undefined}
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

      {/* Add Line Item Form */}
      <AddBudgetItemForm
        onAddRole={handleAddRole}
        onAddExpense={(expense) => saveExpense(expense, null)}
        existingRoles={roles}
      />

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        <AccentButton
          secondary
          className="flex-1"
          onClick={() => setStep(1)}
        >
          ← Back
        </AccentButton>
        <AccentButton
          className="flex-1"
          disabled={sumPercent !== 100}
          onClick={() => setStep(3)}
        >
          Next: Funding →
        </AccentButton>
      </div>

      {/* Modals */}
      <AddRoleModal
        open={roleModalOpen}
        defaultRole={editingRoleIdx !== null ? roles[editingRoleIdx] : undefined}
        onClose={() => setRoleModalOpen(false)}
        onSave={role => {
          const roleWithPercent: Role = {
            ...role,
            percentNum: role.percent || 10,
            percentStr: (role.percent || 10).toString(),
            isFixed: false
          };
          saveRole(roleWithPercent, editingRoleIdx);
          setRoleModalOpen(false);
        }}
        existingRoles={roles}
      />
      
      <AddExpenseModal
        open={expenseModalOpen}
        defaultExpense={editingExpenseIdx !== null ? expenses[editingExpenseIdx] : undefined}
        onClose={() => setExpenseModalOpen(false)}
        onSave={expense => {
          saveExpense({ ...expense, isFixed: true }, editingExpenseIdx);
          setExpenseModalOpen(false);
        }}
      />
    </div>
  );
};
