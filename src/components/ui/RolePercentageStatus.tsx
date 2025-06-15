
import React from "react";

type RolePercentageStatusProps = {
  sumPercent: number;
};

export const RolePercentageStatus: React.FC<RolePercentageStatusProps> = ({
  sumPercent,
}) => {
  let percentMsg = "";
  let percentColor = "";
  
  if (sumPercent < 100)
    percentMsg = `Need ${100 - sumPercent} % allocated`;
  else if (sumPercent > 100)
    percentMsg = `Remove ${sumPercent - 100} % (over-allocated)`;
  else percentMsg = "Cuts balanced ✓";
  
  percentColor = sumPercent === 100 ? "text-green-400" : "text-red-500";

  return (
    <div className={`text-sm font-semibold ${percentColor} mb-2`}>
      {percentMsg}
    </div>
  );
};
