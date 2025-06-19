
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";

interface ProjectPreviewProps {
  state: StreamlinedWizardState;
}

export const ProjectPreview: React.FC<ProjectPreviewProps> = ({ state }) => {
  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amountUSDC, 0);
  const pledgeAmount = parseInt(state.pledgeUSDC) || 0;

  return (
    <Card className="border-accent/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"></div>
            <span className="font-medium">{state.projectType} Project</span>
          </div>
          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Live Preview</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">
            {state.projectIdea.split(' ').slice(0, 8).join(' ')}
            {state.projectIdea.split(' ').length > 8 && '...'}
          </h3>
          <p className="text-sm text-text/70 line-clamp-3">{state.projectIdea}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span>Target: ${totalExpenses.toLocaleString()}</span>
          <span>Raised: ${pledgeAmount.toLocaleString()}</span>
        </div>
        
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((pledgeAmount / totalExpenses) * 100, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-text/60">
            {state.roles.length} {state.roles.length === 1 ? 'member' : 'members'}
          </div>
          <div className="text-xs text-text/60">
            {state.mode} project
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
