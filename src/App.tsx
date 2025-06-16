import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from "@/components/ui/tooltip"

import Index from '@/pages';
import HowItWorks from '@/pages/HowItWorks';
import Dashboard from '@/pages/Dashboard';
import ProjectDashboard from '@/pages/ProjectDashboard';
import ProjectOverview from '@/pages/ProjectOverview';
import ProjectWorkspace from '@/pages/ProjectWorkspace';
import ProjectLaunchHubRoute from '@/pages/ProjectLaunchHubRoute';
import NotFound from '@/pages/NotFound';

import TradingHub from "@/pages/TradingHub";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectDashboard />} />
            <Route path="/project/:id/overview" element={<ProjectOverview />} />
            <Route path="/project/:id/workspace" element={<ProjectWorkspace />} />
            <Route path="/launch" element={<ProjectLaunchHubRoute />} />
            <Route path="/trading" element={<TradingHub />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
