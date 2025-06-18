
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      disabled={loading || disabled}
      className={cn(className)}
      {...props}
    >
      {loading && <Loader className="w-4 h-4 animate-spin mr-2" />}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
};
