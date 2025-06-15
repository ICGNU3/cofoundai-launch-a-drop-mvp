
import React from "react";

type RolePercentageStatusProps = {
  sumPercent: number;
  hasExpenses?: boolean;
};

export const RolePercentageStatus: React.FC<RolePercentageStatusProps> = ({
  sumPercent,
  hasExpenses = false,
}) => {
  let percentMsg = "";
  let percentColor = "";
  
  if (sumPercent < 100 && !hasExpenses) {
    percentMsg = `Need ${100 - sumPercent}% more`;
    percentColor = "text-red-500";
  } else if (sumPercent > 100) {
    percentMsg = `Remove ${sumPercent - 100}%`;
    percentColor = "text-red-500";
  } else if (sumPercent === 100) {
    percentMsg = "Cuts balanced ✓";
    percentColor = "text-green-400";
  } else {
    percentMsg = `${100 - sumPercent}% remaining`;
    percentColor = "text-yellow-500";
  }

  return (
    <div className={`text-sm font-semibold ${percentColor} mb-2`}>
      {percentMsg}
    </div>
  );
};
