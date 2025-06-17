
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
  // Get Privy App ID with more robust error handling
  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;
  
  // Enhanced debug logging
  console.log('Environment check:', {
    privyAppId: privyAppId || 'undefined',
    hasPrivyAppId: !!privyAppId,
    envMode: import.meta.env.MODE,
    allEnvVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
  });
  
  const privyConfig: PrivyClientConfig = {
    loginMethods: ["wallet", "email"] as ("wallet" | "email")[],
    appearance: {
      theme: "dark",
      accentColor: "#36DF8C",
    },
    defaultChain: config.chains[0], // Use Zora Sepolia as default
  };

  // Check if Privy App ID is missing or invalid
  if (!privyAppId || privyAppId === 'your_app_id' || privyAppId === 'undefined') {
    console.error('VITE_PRIVY_APP_ID is missing, undefined, or still set to placeholder value');
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-card border border-border rounded-lg">
          <h1 className="text-xl font-bold mb-4 text-red-500">Configuration Required</h1>
          <p className="text-body-text mb-4">
            Privy App ID is not configured. Please refresh the page or restart the development server.
          </p>
          <div className="text-sm text-body-text/70 bg-surface p-3 rounded border mb-4">
            <p className="font-mono">VITE_PRIVY_APP_ID={privyAppId || 'undefined'}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-accent text-black rounded hover:bg-accent/90 transition-colors"
          >
            Refresh Page
          </button>
          <div className="mt-4 text-xs text-body-text/50">
            If this persists, the development server may need to be restarted.
          </div>
        </div>
      </div>
    );
  }

  console.log('Privy configuration successful with app ID:', privyAppId);

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
