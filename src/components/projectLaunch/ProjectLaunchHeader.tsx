
import React from "react";

interface ProjectLaunchHeaderProps {
  projectIdea: string;
  zoraCoinUrl?: string;
}

export const ProjectLaunchHeader: React.FC<ProjectLaunchHeaderProps> = ({
  projectIdea,
  zoraCoinUrl,
}) => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-500 via-accent to-primary text-white py-8 px-4 text-center relative">
      <div className="absolute left-0 right-0 flex justify-center -top-8">
        <span className="text-7xl">🎉</span>
      </div>
      <h2 className="text-3xl font-headline font-bold mb-2 mt-6">All Systems Go!</h2>
      <div className="text-lg font-medium">Your Drop Has Been Successfully Launched!</div>
    </div>
  );
};
