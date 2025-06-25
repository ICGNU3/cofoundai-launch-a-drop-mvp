
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import ProjectDashboard from '@/pages/ProjectDashboard';
import ProjectOverview from '@/pages/ProjectOverview';
import ProjectWorkspace from '@/pages/ProjectWorkspace';
import { ProjectLaunchHubRoute } from '@/pages/ProjectLaunchHubRoute';
import TradingHub from '@/pages/TradingHub';
import FarcasterIntegration from '@/pages/FarcasterIntegration';
import FarcasterFramePage from '@/pages/FarcasterFramePage';
import HowItWorks from '@/pages/HowItWorks';
import NotFound from '@/pages/NotFound';
import { TokenGatedContentPage } from '@/components/TokenGatedContentPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      
      {/* Dashboard & Project Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/project/:id" element={<ProjectDashboard />} />
      <Route path="/project/:id/overview" element={<ProjectOverview />} />
      <Route path="/project/:id/workspace" element={<ProjectWorkspace />} />
      <Route path="/project/:id/launch" element={<ProjectLaunchHubRoute />} />
      
      {/* Trading Routes */}
      <Route path="/trading" element={<TradingHub />} />
      
      {/* Token-Gated Content Route */}
      <Route path="/token-gated" element={<TokenGatedContentPage />} />
      
      {/* Social/Farcaster Routes */}
      <Route path="/farcaster" element={<FarcasterIntegration />} />
      <Route path="/frame/:tokenAddress" element={<FarcasterFramePage />} />
      
      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
