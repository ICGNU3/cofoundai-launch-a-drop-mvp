
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import ProjectDashboard from './pages/ProjectDashboard';
import ProjectOverview from './pages/ProjectOverview';
import ProjectWorkspace from './pages/ProjectWorkspace';
import { ProjectLaunchHubRoute } from './pages/ProjectLaunchHubRoute';
import TradingHub from './pages/TradingHub';
import FarcasterIntegration from './pages/FarcasterIntegration';
import FarcasterFramePage from './pages/FarcasterFramePage';
import HowItWorks from './pages/HowItWorks';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectDashboard />} />
            <Route path="/project/:id/overview" element={<ProjectOverview />} />
            <Route path="/project/:id/workspace" element={<ProjectWorkspace />} />
            <Route path="/project/:id/launch" element={<ProjectLaunchHubRoute />} />
            <Route path="/trading" element={<TradingHub />} />
            <Route path="/farcaster" element={<FarcasterIntegration />} />
            <Route path="/frame/:tokenAddress" element={<FarcasterFramePage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
