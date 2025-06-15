
import React from "react";
import { useParams, Link } from "react-router-dom";
import { TaskManager } from "@/components/workspace/TaskManager";
import { ProjectFiles } from "@/components/workspace/ProjectFiles";
import { MilestoneList } from "@/components/workspace/MilestoneList";
import { ActivityFeed } from "@/components/workspace/ActivityFeed";
import { DiscussionThreads } from "@/components/workspace/DiscussionThreads";
import { Button } from "@/components/ui/button";

const ProjectWorkspace: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <div>Project not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Collaborative Workspace</h1>
          <Link to={`/project/${projectId}/dashboard`}>
            <Button variant="outline">← Back to Project Dashboard</Button>
          </Link>
        </div>
        <div className="space-y-10">
          <TaskManager projectId={projectId} />
          <MilestoneList projectId={projectId} />
          <ProjectFiles projectId={projectId} />
          <ActivityFeed projectId={projectId} />
          <DiscussionThreads projectId={projectId} />
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkspace;
