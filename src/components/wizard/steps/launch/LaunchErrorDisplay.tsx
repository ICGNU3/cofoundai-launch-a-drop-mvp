
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, X } from "lucide-react";

interface LaunchErrorDisplayProps {
  error: string;
  onDismiss: () => void;
}

export const LaunchErrorDisplay: React.FC<LaunchErrorDisplayProps> = ({
  error,
  onDismiss,
}) => {
  return (
    <Card className="bg-red-50 border-red-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-700 font-medium">Launch Failed</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-red-500 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
