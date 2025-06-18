
import { useCallback } from 'react';
import { toast } from '@/components/ui/sonner';

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  timestamp: Date;
  context?: Record<string, any>;
}

export const useErrorHandler = () => {
  const logError = useCallback((error: Error | AppError, context?: Record<string, any>) => {
    const errorInfo: AppError = {
      code: 'code' in error ? error.code : 'UNKNOWN_ERROR',
      message: error.message,
      userMessage: getUserFriendlyMessage(error),
      timestamp: new Date(),
      context: { ...context, stack: error.stack }
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[ERROR_LOG]', errorInfo);
    }

    // In production, this would send to a logging service like Sentry
    // sendToLoggingService(errorInfo);

    return errorInfo;
  }, []);

  const handleError = useCallback((error: Error | AppError, context?: Record<string, any>) => {
    const errorInfo = logError(error, context);
    
    toast.error(errorInfo.userMessage, {
      description: "Please try again or contact support if the issue persists.",
      duration: 5000,
    });

    return errorInfo;
  }, [logError]);

  const handleAsyncError = useCallback(async (operation: () => Promise<any>, context?: Record<string, any>) => {
    try {
      return await operation();
    } catch (error) {
      handleError(error as Error, context);
      throw error;
    }
  }, [handleError]);

  return { logError, handleError, handleAsyncError };
};

function getUserFriendlyMessage(error: Error | AppError): string {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch')) {
    return "Network connection issue. Please check your internet connection and try again.";
  }
  
  if (message.includes('wallet') || message.includes('rejected')) {
    return "Wallet operation was cancelled. Please try connecting your wallet again.";
  }
  
  if (message.includes('insufficient')) {
    return "Insufficient funds in your wallet. Please add more funds and try again.";
  }
  
  if (message.includes('gas')) {
    return "Transaction fee estimation failed. Please try again with a higher gas limit.";
  }
  
  if (message.includes('unauthorized') || message.includes('forbidden')) {
    return "You don't have permission to perform this action. Please sign in and try again.";
  }
  
  if (message.includes('not found')) {
    return "The requested resource could not be found. It may have been moved or deleted.";
  }
  
  if (message.includes('timeout')) {
    return "The operation took too long to complete. Please try again.";
  }
  
  return "Something went wrong. Please try again or contact support if the issue continues.";
}
