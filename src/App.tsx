import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivyProvider } from '@privy-io/react-auth';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProjectOverview from "./pages/ProjectOverview";
import ProjectDashboard from "./pages/ProjectDashboard";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import NotFound from "./pages/NotFound";
import { ProjectLaunchHubRoute } from "@/pages/ProjectLaunchHubRoute";

// --- Wagmi imports for v2+ ---
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, walletConnect } from 'wagmi/connectors';

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(), // Use public node, or your own RPC URL.
  },
  connectors: [
    injected({}),
    walletConnect({ projectId: "wagmi-example" }),
  ],
  ssr: false,
});

const queryClient = new QueryClient();

const App = () => (
  <PrivyProvider
    appId="cmbwrcdqp00sijy0mx4wx4aew"
    config={{
      appearance: {
        theme: 'dark',
        accentColor: '#9A4DFF',
      },
      embeddedWallets: {
        createOnLogin: 'users-without-wallets',
      },
    }}
  >
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/project/:projectId" element={<ProjectOverview />} />
              <Route path="/project/:projectId/dashboard" element={<ProjectDashboard />} />
              <Route path="/project/:projectId/launch" element={<ProjectLaunchHubRoute />} />
              <Route path="/workspace/:projectId" element={<ProjectWorkspace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </PrivyProvider>
);

export default App;
