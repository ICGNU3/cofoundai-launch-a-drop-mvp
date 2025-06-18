
import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobalLoaderProps {
  isLoading: boolean;
  message?: string;
  overlay?: boolean;
  className?: string;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({
  isLoading,
  message = "Loading...",
  overlay = true,
  className
}) => {
  if (!isLoading) return null;

  return (
    <div className={cn(
      "flex items-center justify-center",
      overlay && "fixed inset-0 bg-background/80 backdrop-blur-sm z-50",
      !overlay && "py-8",
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        <Loader className="w-8 h-8 animate-spin text-accent" />
        <p className="text-sm text-text/70">{message}</p>
      </div>
    </div>
  );
};
