import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PrivyProvider, usePrivy, CHAINS } from "@privy-io/react-auth";
import React from "react";

const queryClient = new QueryClient();

const PRIVY_APP_ID = "cmbwrcdqp00sijy0mx4wx4aew";

// Simple UI at the top for login/logout with Privy
const PrivyAuthBar = () => {
  const { ready, authenticated, user, login, logout } = usePrivy();
  if (!ready) return null;

  let userDisplay = "";
  if (user?.email && typeof user.email === "string") {
    userDisplay = user.email;
  } else if (user?.wallet?.address && typeof user.wallet.address === "string") {
    userDisplay = user.wallet.address.slice(0, 8);
  } else {
    userDisplay = "User";
  }

  return (
    <div className="w-full flex justify-end p-2">
      {authenticated ? (
        <div className="flex gap-4 items-center">
          <span className="text-xs text-zinc-300">Hi, {userDisplay}</span>
          <button
            className="bg-zinc-800 px-3 py-1 rounded text-xs hover:bg-zinc-700"
            onClick={logout}
            type="button"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          className="bg-purple-600 px-3 py-1 rounded text-xs text-white hover:bg-purple-700"
          onClick={login}
          type="button"
        >
          Login / Sign Up
        </button>
      )}
    </div>
  );
};

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <PrivyProvider
    appId={PRIVY_APP_ID}
    config={{
      loginMethods: ['email', 'wallet'],
      appearance: { theme: 'dark' },
      defaultChain: CHAINS.baseSepolia,
      supportedChains: [CHAINS.baseSepolia],
      embeddedWallets: { createOnLogin: "all-users" },
    }}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PrivyAuthBar />
        <AppRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  </PrivyProvider>
);

export default App;
