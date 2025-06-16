
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import ProjectDashboard from '@/pages/ProjectDashboard';
import ProjectOverview from '@/pages/ProjectOverview';
import ProjectWorkspace from '@/pages/ProjectWorkspace';
import { ProjectLaunchHubRoute } from '@/pages/ProjectLaunchHubRoute';

export const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/project/:id" element={<ProjectDashboard />} />
      <Route path="/project/:id/overview" element={<ProjectOverview />} />
      <Route path="/project/:id/workspace" element={<ProjectWorkspace />} />
      <Route path="/project/:id/launch" element={<ProjectLaunchHubRoute />} />
    </Routes>
  );
};
