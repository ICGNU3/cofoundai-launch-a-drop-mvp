
import React from "react";

export const TeamBudgetHeader: React.FC = () => {
  return (
    <div className="text-center space-y-2 mb-6">
      <h2 className="text-xl sm:text-2xl font-light tracking-tighter text-headline font-inter">
        Team & Budget Setup
      </h2>
      <p className="text-sm text-tagline font-light tracking-wide font-inter">
        Define your team roles and project expenses
      </p>
    </div>
  );
};
