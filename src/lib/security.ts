/**
 * Security utilities and configurations
 */

// Content Security Policy for enhanced XSS protection
export const getCSPDirectives = () => {
  return {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline'", // Allow inline scripts for React
    'style-src': "'self' 'unsafe-inline'", // Allow inline styles for CSS-in-JS
    'img-src': "'self' data: https:", // Allow images from same origin, data URLs, and HTTPS
    'font-src': "'self' https:", // Allow fonts from same origin and HTTPS
    'connect-src': "'self' https://salla-shop.com", // Allow connections to API endpoints
    'frame-ancestors': "'none'", // Prevent clickjacking
    'base-uri': "'self'", // Restrict base tag URLs
    'form-action': "'self'", // Restrict form submissions
  };
};

// Generate CSP header string
export const generateCSPHeader = (): string => {
  const directives = getCSPDirectives();
  return Object.entries(directives)
    .map(([key, value]) => `${key} ${value}`)
    .join('; ');
};

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 1000); // Limit length
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};