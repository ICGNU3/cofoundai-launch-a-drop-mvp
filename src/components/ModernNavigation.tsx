
import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";

const ModernNavigation: React.FC = () => {
  const { authenticated, login } = usePrivy();

  return (
    <nav className="container mx-auto px-6 py-6 relative z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
          </svg>
          <span className="ml-3 text-xl tracking-tight font-medium">NEPLUS</span>
        </div>
        <div className="hidden md:flex space-x-10 text-sm text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#community" className="hover:text-white transition-colors">Community</a>
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
        </div>
        <div>
          {!authenticated && (
            <Button
              className="text-sm border border-gray-700 rounded-md px-4 py-2 hover:bg-white/5 transition-all bg-transparent text-white"
              onClick={login}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ModernNavigation;
