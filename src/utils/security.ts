
import DOMPurify from 'dompurify';

// Input validation utilities
export const validation = {
  // Text validation - prevents XSS and validates length
  validateText: (text: string, maxLength: number = 500): { isValid: boolean; error?: string } => {
    if (!text || text.trim().length === 0) {
      return { isValid: false, error: 'This field is required' };
    }
    
    if (text.length > maxLength) {
      return { isValid: false, error: `Text must be ${maxLength} characters or less` };
    }
    
    // Check for potential XSS patterns
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi
    ];
    
    for (const pattern of xssPatterns) {
      if (pattern.test(text)) {
        return { isValid: false, error: 'Invalid characters detected' };
      }
    }
    
    return { isValid: true };
  },

  // Email validation
  validateEmail: (email: string): { isValid: boolean; error?: string } => {
    if (!email || email.trim().length === 0) {
      return { isValid: false, error: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  },

  // Wallet address validation
  validateWalletAddress: (address: string): { isValid: boolean; error?: string } => {
    if (!address || address.trim().length === 0) {
      return { isValid: false, error: 'Wallet address is required' };
    }
    
    // Basic Ethereum address validation
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(address)) {
      return { isValid: false, error: 'Please enter a valid Ethereum wallet address' };
    }
    
    return { isValid: true };
  },

  // Number validation
  validateNumber: (value: string | number, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): { isValid: boolean; error?: string } => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) {
      return { isValid: false, error: 'Please enter a valid number' };
    }
    
    if (num < min) {
      return { isValid: false, error: `Value must be at least ${min}` };
    }
    
    if (num > max) {
      return { isValid: false, error: `Value must be ${max} or less` };
    }
    
    return { isValid: true };
  },

  // Percentage validation
  validatePercentage: (value: string | number): { isValid: boolean; error?: string } => {
    return validation.validateNumber(value, 0, 100);
  }
};

// Content sanitization utilities
export const sanitize = {
  // Sanitize HTML content to prevent XSS
  html: (content: string): string => {
    if (typeof window === 'undefined') {
      // Server-side fallback - basic sanitization
      return content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }
    
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: []
    });
  },

  // Sanitize plain text
  text: (text: string): string => {
    return text
      .replace(/[<>]/g, '') // Remove < and > characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .trim();
  },

  // Sanitize user input for database storage
  userInput: (input: string): string => {
    return sanitize.text(input).substring(0, 1000); // Limit length
  }
};

// Security headers and CSP utilities
export const security = {
  // Generate a secure random string
  generateToken: (): string => {
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    // Fallback for environments without crypto
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  },

  // Rate limiting helper (client-side)
  createRateLimiter: (maxAttempts: number, windowMs: number) => {
    const attempts = new Map<string, { count: number; resetTime: number }>();
    
    return (key: string): boolean => {
      const now = Date.now();
      const attempt = attempts.get(key);
      
      if (!attempt || now > attempt.resetTime) {
        attempts.set(key, { count: 1, resetTime: now + windowMs });
        return true;
      }
      
      if (attempt.count >= maxAttempts) {
        return false;
      }
      
      attempt.count++;
      return true;
    };
  }
};
