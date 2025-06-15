import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import React, { useState, useEffect } from "react";
import { createSafe } from "@/lib/safe";

// Define the Base Sepolia chain object in the correct format for Privy and wagmi
const baseSepoliaChain = {
  id: 84532,
  name: "Base Sepolia",
  rpcUrls: {
    default: {
      http: ["https://sepolia.base.org"],
      // webSocket: [], // You can add websocket endpoints here if needed.
    },
    // privyWalletOverride could be added if Privy suggests a special endpoint, but it's optional.
  },
  blockExplorers: {
    default: {
      name: "Base Sepolia Explorer",
      url: "https://sepolia.basescan.org",
    },
  },
  nativeCurrency: {
    name: "Base Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  icon: {
    url: "https://cryptologos.cc/logos/base-base-logo.png",
    alt: "Base Logo"
  },
  testnet: true,
};

const queryClient = new QueryClient();

const PRIVY_APP_ID = "cmbwrcdqp00sijy0mx4wx4aew";

// Simple UI at the top for login/logout with Privy
const PrivyAuthBar = () => {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [safeAddress, setSafeAddress] = useState<string | null>(null);

  // Log addresses after login
  useEffect(() => {
    if (authenticated && user?.wallet?.address && !safeAddress) {
      const privyWalletAddress = user.wallet.address;
      // Only create Safe if we haven't already
      createSafe(privyWalletAddress as `0x${string}`)
        .then((safeAddr) => {
          setSafeAddress(safeAddr);
          console.log("privyWalletAddress:", privyWalletAddress);
          console.log("safeAddress:", safeAddr);
        })
        .catch((e) => {
          // Optionally, log any error
          console.error("Safe creation error", e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, user?.wallet?.address, safeAddress]);

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
      defaultChain: baseSepoliaChain,
      supportedChains: [baseSepoliaChain],
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
