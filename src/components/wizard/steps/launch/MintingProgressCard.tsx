
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MintingProgressCardProps {
  isMinting: boolean;
  mintingStatus: string;
  progress: number;
}

export const MintingProgressCard: React.FC<MintingProgressCardProps> = ({
  isMinting,
  mintingStatus,
  progress,
}) => {
  if (!isMinting) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Launching Project...</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-text/70">{mintingStatus}</div>
          <div className="w-full bg-background rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
