import { z } from 'zod';

/**
 * Validation schemas for user inputs
 */

// Common validation patterns
export const schemas = {
  // URL validation
  url: z.string().url().max(2048),
  
  // Text input validation
  safeText: z.string()
    .min(1)
    .max(500)
    .regex(/^[a-zA-Z0-9\s\u0600-\u06FF.,!?-]+$/, 'Invalid characters detected'),
  
  // App key validation (for future use)
  appKey: z.string()
    .min(2)
    .max(50)
    .regex(/^[a-z]+$/, 'App key must contain only lowercase letters'),
  
  // Language code validation
  languageCode: z.enum(['en', 'ar']),
  
  // Theme validation
  theme: z.enum(['light', 'dark', 'system']),
};

// Helper function to validate data
export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};

// Safe parsing with error handling
export const safeValidate = <T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Validation failed' };
    }
    return { success: false, error: 'Unknown validation error' };
  }
};