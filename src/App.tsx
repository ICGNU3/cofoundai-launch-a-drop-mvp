
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { PrivyProvider } from '@privy-io/react-auth';
import type { PrivyClientConfig } from '@privy-io/react-auth';
import { config } from './lib/wagmi';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function App() {
  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;
  
  const privyConfig: PrivyClientConfig = {
    loginMethods: ["wallet", "email"] as ("wallet" | "email")[],
    appearance: {
      theme: "dark",
      accentColor: "#36DF8C",
    },
    defaultChain: config.chains[0], // Use Zora Sepolia as default
  };

  if (!privyAppId) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-card border border-border rounded-lg">
          <h1 className="text-xl font-bold mb-4 text-red-500">Configuration Required</h1>
          <p className="text-body-text mb-4">
            Privy App ID is not configured. Please set up your environment variables.
          </p>
          <div className="text-sm text-body-text/70 bg-surface p-3 rounded border">
            <p className="font-mono">VITE_PRIVY_APP_ID=your_app_id</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <PrivyProvider
          appId={privyAppId}
          config={privyConfig}
        >
          <AuthProvider>
            <OnboardingProvider>
              <Toaster />
              <Router>
                <AppRoutes />
              </Router>
            </OnboardingProvider>
          </AuthProvider>
        </PrivyProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;
