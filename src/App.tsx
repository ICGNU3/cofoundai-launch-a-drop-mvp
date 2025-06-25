
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { PrivyProvider } from '@privy-io/react-auth';
import { config } from './lib/wagmi';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { WalletConnectionProvider } from './components/WalletConnectionProvider';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function App() {
  const privyAppId = 'cmbwrcdqp00sijy0mx4wx4aew';

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ['wallet', 'email'],
        appearance: {
          theme: 'dark',
          accentColor: '#36DF8C',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <WalletConnectionProvider>
            <AuthProvider>
              <Router>
                <div className="min-h-screen bg-background text-foreground">
                  <AppRoutes />
                  <Toaster />
                </div>
              </Router>
            </AuthProvider>
          </WalletConnectionProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

export default App;
