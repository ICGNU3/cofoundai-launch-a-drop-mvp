
import React from "react";

interface LaunchHelpTextProps {
  isLaunching: boolean;
  isMinting: boolean;
  allValidationsPassed: boolean;
}

export const LaunchHelpText: React.FC<LaunchHelpTextProps> = ({
  isLaunching,
  isMinting,
  allValidationsPassed,
}) => {
  const getHelpMessage = () => {
    if (isLaunching || isMinting) {
      return "Please wait while we deploy your project to the blockchain...";
    }
    if (allValidationsPassed) {
      return "Your project will be deployed to the blockchain and made available for supporters";
    }
    return "Complete all validation requirements above to proceed with launch";
  };

  return (
    <div className="text-center text-xs text-text/50 border-t border-border pt-4">
      <p>{getHelpMessage()}</p>
    </div>
  );
};
