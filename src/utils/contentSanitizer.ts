
import { sanitize } from '@/utils/security';

// Content display utilities with security
export const displayContent = {
  // Safely display user-generated text content
  safeText: (content: string): string => {
    if (!content) return '';
    return sanitize.text(content);
  },

  // Safely display rich text content (preserving some formatting)
  safeHtml: (content: string): string => {
    if (!content) return '';
    return sanitize.html(content);
  },

  // Truncate content safely
  truncate: (content: string, maxLength: number = 150): string => {
    const safe = sanitize.text(content);
    if (safe.length <= maxLength) return safe;
    return safe.substring(0, maxLength - 3) + '...';
  },

  // Extract preview text from content
  preview: (content: string, maxLength: number = 100): string => {
    return displayContent.truncate(content, maxLength);
  }
};

// Project-specific content sanitizers
export const projectContent = {
  // Sanitize project ideas and descriptions
  sanitizeProjectIdea: (idea: string): string => {
    return sanitize.userInput(idea).substring(0, 2000);
  },

  // Sanitize role names
  sanitizeRoleName: (name: string): string => {
    return sanitize.userInput(name).substring(0, 100);
  },

  // Sanitize expense names
  sanitizeExpenseName: (name: string): string => {
    return sanitize.userInput(name).substring(0, 200);
  },

  // Sanitize team messages
  sanitizeMessage: (message: string): string => {
    return sanitize.userInput(message).substring(0, 1000);
  }
};
