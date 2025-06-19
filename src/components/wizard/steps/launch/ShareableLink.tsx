
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";

interface ShareableLinkProps {
  state: StreamlinedWizardState;
}

export const ShareableLink: React.FC<ShareableLinkProps> = ({ state }) => {
  const mockProjectUrl = `https://yourapp.com/project/${state.projectIdea.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Shareable Link</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 p-2 bg-background border rounded">
          <input 
            type="text" 
            value={mockProjectUrl} 
            readOnly 
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <Button size="sm" variant="ghost">
            <Copy className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-text/60 mt-2">
          This link will be available after launch for sharing with supporters
        </p>
      </CardContent>
    </Card>
  );
};
