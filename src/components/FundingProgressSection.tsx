
import React from "react";
import { ProjectFundingProgress } from "@/components/ProjectOverviewParts";

export const FundingProgressSection = ({ project }: { project: any }) => (
  <div className="bg-card border border-border rounded-lg p-6 mb-8">
    <ProjectFundingProgress project={project} />
  </div>
);
