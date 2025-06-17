import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { PrivyProvider } from '@privy-io/react-auth';
import { config } from './lib/wagmi';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function App() {
  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID || 'clpispdcl00lu356f5oh7yl54';
  const privyConfig = {
    loginMethods: ['wallet', 'email'],
    appearance: {
      theme: 'dark' as const,
      accentColor: '#36DF8C' as const,
    },
  };

  if (!privyAppId) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Configuration Error</h1>
          <p>Privy App ID is not configured. Please check your environment variables.</p>
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
