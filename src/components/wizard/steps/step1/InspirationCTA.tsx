
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface InspirationCTAProps {
  onShowInspiration: () => void;
}

export const InspirationCTA: React.FC<InspirationCTAProps> = ({
  onShowInspiration,
}) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-light text-blue-800 font-inter tracking-wide">
              Need inspiration?
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onShowInspiration}
            className="text-blue-700 border-blue-300 hover:bg-blue-100 font-light font-inter"
          >
            View Examples
          </Button>
        </div>
        <p className="text-xs text-blue-700 mt-1 font-light font-inter tracking-wide">
          Check out successful projects to spark your creativity
        </p>
      </CardContent>
    </Card>
  );
};
