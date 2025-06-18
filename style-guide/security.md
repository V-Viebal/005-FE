# VieVPS Frontend - Security Style Guide

## Authentication & Authorization

### Token Management

#### Secure Token Storage
```typescript
// services/tokenService.ts
interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'vievps_access_token';
  private readonly REFRESH_TOKEN_KEY = 'vievps_refresh_token';

  // ✅ Good - Store tokens securely
  setTokens(tokens: TokenPair): void {
    // Store access token in memory (more secure)
    this.accessToken = tokens.accessToken;
    
    // Store refresh token in httpOnly cookie (most secure)
    // This should be set by the server, not client-side
    document.cookie = `${this.REFRESH_TOKEN_KEY}=${tokens.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/`;
  }

  getAccessToken(): string | null {
    return this.accessToken || null;
  }

  // ✅ Good - Clear tokens on logout
  clearTokens(): void {
    this.accessToken = null;
    document.cookie = `${this.REFRESH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // ❌ Bad - Don't store sensitive tokens in localStorage
  // localStorage.setItem('token', token); // Vulnerable to XSS

  private accessToken: string | null = null;
}

export const tokenService = new TokenService();
```

#### JWT Token Validation
```typescript
// utils/tokenValidation.ts
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string;
  exp: number;
  iat: number;
  role: string;
}

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getTokenPayload = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    return null;
  }
};

export const shouldRefreshToken = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - currentTime;
    
    // Refresh if token expires in less than 5 minutes
    return timeUntilExpiry < 300;
  } catch (error) {
    return true;
  }
};
```

### Protected Routes
```typescript
// components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = [],
  fallbackPath = '/login'
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRole.length > 0 && user && !requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

### Role-Based Access Control
```typescript
// hooks/usePermissions.ts
import { useAuth } from './useAuth';

type Permission = 
  | 'user:read'
  | 'user:write'
  | 'user:delete'
  | 'vps:read'
  | 'vps:write'
  | 'vps:delete'
  | 'admin:access';

type Role = 'admin' | 'user' | 'moderator';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'user:read', 'user:write', 'user:delete',
    'vps:read', 'vps:write', 'vps:delete',
    'admin:access'
  ],
  moderator: [
    'user:read', 'user:write',
    'vps:read', 'vps:write'
  ],
  user: [
    'vps:read', 'vps:write'
  ]
};

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role as Role] || [];
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
};
```

## Input Validation & Sanitization

### Form Input Validation
```typescript
// utils/validation.ts
import DOMPurify from 'dompurify';

// ✅ Good - Comprehensive email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// ✅ Good - Strong password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ✅ Good - Sanitize HTML input
export const sanitizeHtml = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};

// ✅ Good - Validate and sanitize user input
export const validateAndSanitizeInput = (input: string, maxLength: number = 255): string => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  // Remove null bytes and control characters
  const cleaned = input.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Trim whitespace
  const trimmed = cleaned.trim();
  
  // Check length
  if (trimmed.length > maxLength) {
    throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
  }
  
  return trimmed;
};

// ✅ Good - SQL injection prevention (for search queries)
export const sanitizeSearchQuery = (query: string): string => {
  // Remove SQL injection patterns
  return query
    .replace(/[';"\\]/g, '') // Remove quotes and backslashes
    .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b/gi, '') // Remove SQL keywords
    .trim();
};
```

### Secure Form Component
```typescript
// components/forms/SecureForm.tsx
import React, { useState } from 'react';
import { validateAndSanitizeInput, validateEmail, validatePassword } from '@/utils/validation';

interface SecureFormProps {
  onSubmit: (data: FormData) => void;
  csrfToken?: string;
}

interface FormData {
  email: string;
  password: string;
  name: string;
}

export const SecureForm: React.FC<SecureFormProps> = ({ onSubmit, csrfToken }) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    
    try {
      // Validate and sanitize input
      const sanitizedValue = validateAndSanitizeInput(value, 255);
      
      setFormData(prev => ({
        ...prev,
        [field]: sanitizedValue
      }));
      
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [field]: error instanceof Error ? error.message : 'Invalid input'
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }
    
    // Validate name
    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* CSRF Token */}
      {csrfToken && (
        <input type="hidden" name="_token" value={csrfToken} />
      )}
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          autoComplete="email"
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          autoComplete="new-password"
          required
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange('name')}
          autoComplete="name"
          required
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

## API Security

### Secure HTTP Client
```typescript
// services/httpClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenService } from './tokenService';
import { AppError, NetworkError, AuthenticationError } from '@/types/Errors';

class HttpClient {
  private client: AxiosInstance;
  private readonly baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10 seconds
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest' // CSRF protection
      },
      withCredentials: true // Include cookies for CSRF tokens
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = tokenService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add CSRF token if available
        const csrfToken = this.getCSRFToken();
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            await this.refreshToken();
            return this.client(originalRequest);
          } catch (refreshError) {
            tokenService.clearTokens();
            window.location.href = '/login';
            return Promise.reject(new AuthenticationError());
          }
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private getCSRFToken(): string | null {
    // Get CSRF token from meta tag or cookie
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) return metaToken;
    
    // Fallback to cookie
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  private async refreshToken(): Promise<void> {
    try {
      const response = await axios.post(`${this.baseURL}/auth/refresh`, {}, {
        withCredentials: true
      });
      
      const { accessToken } = response.data.data;
      tokenService.setTokens({ accessToken, refreshToken: '' });
    } catch (error) {
      throw new AuthenticationError('Failed to refresh token');
    }
  }

  private handleError(error: any): AppError {
    if (error.code === 'ECONNABORTED') {
      return new NetworkError('Request timeout');
    }
    
    if (!error.response) {
      return new NetworkError('Network error occurred');
    }
    
    const { status, data } = error.response;
    const message = data?.message || 'An error occurred';
    
    switch (status) {
      case 401:
        return new AuthenticationError(message);
      case 403:
        return new AppError(message, 'FORBIDDEN', 403);
      case 404:
        return new AppError(message, 'NOT_FOUND', 404);
      case 422:
        return new AppError(message, 'VALIDATION_ERROR', 422, data.errors);
      case 429:
        return new AppError('Too many requests', 'RATE_LIMIT', 429);
      default:
        return new AppError(message, 'SERVER_ERROR', status);
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const httpClient = new HttpClient();
```

## Content Security Policy

### CSP Configuration
```typescript
// utils/csp.ts

// ✅ Good - Strict CSP configuration
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Only for development, remove in production
    'https://cdn.jsdelivr.net',
    'https://unpkg.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components
    'https://fonts.googleapis.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'blob:'
  ],
  'connect-src': [
    "'self'",
    process.env.VITE_API_URL || 'http://localhost:3001'
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': []
};

export const generateCSPHeader = (): string => {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
};
```

## XSS Prevention

### Safe HTML Rendering
```typescript
// components/ui/SafeHTML.tsx
import React from 'react';
import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  html: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
  className?: string;
}

export const SafeHTML: React.FC<SafeHTMLProps> = ({
  html,
  allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
  allowedAttributes = ['class'],
  className
}) => {
  const sanitizedHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false
  });

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};
```

### URL Validation
```typescript
// utils/urlValidation.ts

// ✅ Good - Validate URLs to prevent open redirects
export const isValidURL = (url: string): boolean => {
  try {
    const parsedURL = new URL(url);
    
    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(parsedURL.protocol)) {
      return false;
    }
    
    // Check for suspicious patterns
    if (url.includes('javascript:') || url.includes('data:')) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

export const isInternalURL = (url: string): boolean => {
  try {
    const parsedURL = new URL(url, window.location.origin);
    return parsedURL.origin === window.location.origin;
  } catch {
    return false;
  }
};

export const sanitizeRedirectURL = (url: string): string => {
  // Only allow internal URLs for redirects
  if (isInternalURL(url)) {
    return url;
  }
  
  // Default to home page for external URLs
  return '/';
};
```

## Environment Security

### Environment Variables
```typescript
// config/environment.ts

// ✅ Good - Validate environment variables
interface EnvironmentConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  enableDevTools: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

const validateEnvironment = (): EnvironmentConfig => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const environment = import.meta.env.VITE_ENVIRONMENT || 'development';
  
  if (!apiUrl) {
    throw new Error('VITE_API_URL environment variable is required');
  }
  
  if (!isValidURL(apiUrl)) {
    throw new Error('VITE_API_URL must be a valid URL');
  }
  
  return {
    apiUrl,
    environment: environment as EnvironmentConfig['environment'],
    enableDevTools: environment === 'development',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info'
  };
};

export const config = validateEnvironment();

// ❌ Bad - Don't expose sensitive data
// export const API_KEY = import.meta.env.VITE_API_KEY; // This would be visible in the bundle
```

### Secure Development Practices
```typescript
// utils/security.ts

// ✅ Good - Security utilities
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const hashString = async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// ✅ Good - Secure random string generation
export const generateSecureRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => chars[byte % chars.length]).join('');
};

// ✅ Good - Timing-safe string comparison
export const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
};
```

## Security Headers

### Security Headers Setup
```typescript
// utils/securityHeaders.ts

export const SECURITY_HEADERS = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Enforce HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
};

// For Vite configuration
export const viteSecurityHeaders = {
  headers: {
    ...SECURITY_HEADERS,
    'Content-Security-Policy': generateCSPHeader()
  }
};
```

## Best Practices Summary

### Authentication & Authorization ✅
- Store tokens securely (httpOnly cookies for refresh tokens)
- Implement proper token validation and refresh
- Use role-based access control
- Protect sensitive routes
- Clear tokens on logout

### Input Validation ✅
- Validate all user inputs
- Sanitize HTML content
- Use strong password requirements
- Implement CSRF protection
- Validate URLs and redirects

### API Security ✅
- Use HTTPS for all communications
- Implement proper error handling
- Add security headers
- Use request timeouts
- Implement rate limiting awareness

### XSS Prevention ✅
- Sanitize HTML content
- Use Content Security Policy
- Validate and encode user inputs
- Avoid `dangerouslySetInnerHTML` without sanitization

### Environment Security ✅
- Validate environment variables
- Don't expose sensitive data in client bundle
- Use secure random generation
- Implement proper logging without sensitive data

### Common Vulnerabilities to Avoid ❌
- Storing sensitive data in localStorage
- Using `eval()` or similar dynamic code execution
- Trusting user input without validation
- Exposing API keys in client-side code
- Ignoring CORS and CSP policies
- Using weak password requirements
- Not implementing proper session management
- Allowing open redirects