
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface InspirationCTAProps {
  onShowInspiration: () => void;
}

export const InspirationCTA: React.FC<InspirationCTAProps> = ({
  onShowInspiration,
}) => {
  return (
    <Card className="bg-accent/5 border-accent/20">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text">
                <strong>New to project launches?</strong> Browse our template gallery for inspiration and quick setup.
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShowInspiration}
            className="w-full sm:w-auto min-h-[44px] whitespace-nowrap"
          >
            Browse Templates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
