
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface RetryableActionProps {
  action: () => Promise<void>;
  maxRetries?: number;
  retryDelay?: number;
  children: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const RetryableAction: React.FC<RetryableActionProps> = ({
  action,
  maxRetries = 3,
  retryDelay = 1000,
  children,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { handleError } = useErrorHandler();

  const executeAction = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await action();
      setRetryCount(0);
      onSuccess?.();
    } catch (err) {
      const errorInfo = handleError(err as Error, { retryCount, maxRetries });
      setError(errorInfo.userMessage);
      onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [action, retryCount, maxRetries, handleError, onSuccess, onError]);

  const retry = useCallback(async () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      
      // Add delay before retry
      if (retryDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
      }
      
      await executeAction();
    }
  }, [retryCount, maxRetries, retryDelay, executeAction]);

  const canRetry = error && retryCount < maxRetries;

  return (
    <div className="space-y-4">
      <div onClick={executeAction} className="cursor-pointer">
        {children}
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            {canRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={retry}
                disabled={isLoading}
                className="ml-2"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry ({retryCount}/{maxRetries})
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading && (
        <div className="text-sm text-text/60 text-center">
          {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : 'Processing...'}
        </div>
      )}
    </div>
  );
};
