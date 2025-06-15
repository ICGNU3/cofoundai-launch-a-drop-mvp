
import React from "react";

export function SkippingStepLoader() {
  React.useEffect(() => {
    // Side-effect intentionally left empty for possible spinner delays in future.
  }, []);
  return (
    <div className="flex items-center justify-center h-full py-12">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent mb-4"></div>
        <p className="text-lg text-muted-foreground">Skipping step…</p>
      </div>
    </div>
  );
}
