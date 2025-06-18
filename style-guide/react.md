# VieVPS Frontend - React Style Guide

## Component Architecture

### Component Types

#### 1. Page Components
Top-level components that represent entire pages or routes.

```typescript
// pages/Dashboard.tsx
import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

interface DashboardProps {
  // Page-level props if needed
}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <DashboardLayout>
      <StatsCards />
      <RecentActivity />
    </DashboardLayout>
  );
};

export default Dashboard;
```

#### 2. Layout Components
Components that define the structure and layout of pages.

```typescript
// components/layouts/DashboardLayout.tsx
import React from 'react';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { Footer } from '@/components/common/Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  showSidebar = true
}) => {
  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-content">
        {showSidebar && <Sidebar />}
        <main className="main-content">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export { DashboardLayout };
```

#### 3. Feature Components
Components that implement specific business logic or features.

```typescript
// components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validateEmail } from '@/utils/validation';

// Types
interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

// Component
const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  redirectTo = '/dashboard'
}) => {
  // Hooks
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  // Handlers
  const handleInputChange = (field: keyof LoginFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validation
    const newErrors: Partial<LoginFormData> = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      onSuccess?.();
    } catch (error) {
      setErrors({ email: 'Invalid credentials' });
    }
  };

  // Constants
  const FORM_FIELDS = {
    EMAIL: 'email',
    PASSWORD: 'password'
  } as const;

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange(FORM_FIELDS.EMAIL)}
          error={errors.email}
          required
        />
      </div>
      
      <div className="form-group">
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange(FORM_FIELDS.PASSWORD)}
          error={errors.password}
          required
        />
      </div>
      
      <Button
        type="submit"
        variant="primary"
        loading={isLoading}
        disabled={isLoading}
        fullWidth
      >
        Sign In
      </Button>
    </form>
  );
};

export { LoginForm };
```

#### 4. UI Components
Reusable, generic UI components.

```typescript
// components/ui/Button.tsx
import React from 'react';
import { cn } from '@/utils/classNames';

// Types
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

// Component
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}) => {
  // Constants
  const BUTTON_VARIANTS = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700'
  };

  const BUTTON_SIZES = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const buttonClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-colors duration-200',
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    fullWidth && 'w-full',
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export { Button };
export type { ButtonProps };
```

## Component Structure Standard

### Required Sections Order

```typescript
// 1. Imports (following import order from general.md)
import React, { useState, useEffect } from 'react';

// 2. Types
interface ComponentProps {
  // Component props interface
}

interface ComponentState {
  // Internal state interfaces if needed
}

// 3. Component Declaration
const ComponentName: React.FC<ComponentProps> = ({
  // Destructured props with defaults
  prop1,
  prop2 = 'defaultValue'
}) => {
  // 4. Hooks (in order: state, context, custom hooks)
  const [state, setState] = useState<ComponentState>();
  const { contextValue } = useContext(SomeContext);
  const customHookValue = useCustomHook();

  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 6. Handlers
  const handleAction = useCallback(() => {
    // Handler logic
  }, [dependencies]);

  // 7. Constants (component-specific)
  const COMPONENT_CONSTANTS = {
    MAX_ITEMS: 10,
    DEFAULT_MESSAGE: 'Hello World'
  };

  // 8. Computed values
  const computedValue = useMemo(() => {
    return expensiveCalculation(state);
  }, [state]);

  // 9. Early returns (loading, error states)
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  // 10. Main render
  return (
    <div className="component-wrapper">
      {/* JSX content */}
    </div>
  );
};

// 11. Default export
export default ComponentName;

// 12. Named exports (if any)
export type { ComponentProps };
```

## Hooks Guidelines

### Custom Hooks Structure

```typescript
// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';
import { User } from '@/types/User';

// Types
interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// Hook
export const useAuth = (): UseAuthReturn => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effects
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handlers
  const checkAuthStatus = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      await authService.refreshToken();
      await checkAuthStatus();
    } catch (error) {
      logout();
    }
  }, [checkAuthStatus, logout]);

  // Constants
  const isAuthenticated = user !== null;

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshToken
  };
};
```

## Context Providers

### Context Structure

```typescript
// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

// Context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system'
}) => {
  // Hooks
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Effects
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      setActualTheme(systemTheme);
    } else {
      root.classList.add(theme);
      setActualTheme(theme);
    }
  }, [theme]);

  // Constants
  const value: ThemeContextValue = {
    theme,
    actualTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## Error Handling Patterns

### Error Boundary Component

```typescript
// components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

// Types
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Component
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
```

## Performance Optimization

### Memoization Patterns

```typescript
// ✅ Good - Proper memoization
const ExpensiveList = React.memo<ListProps>(({ items, onItemClick }) => {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  const handleItemClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <ul>
      {sortedItems.map(item => (
        <ListItem
          key={item.id}
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </ul>
  );
});
```

### Code Splitting

```typescript
// ✅ Good - Lazy loading with Suspense
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Settings = lazy(() => import('@/pages/Settings'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Router>
  );
};
```

## Testing Patterns

### Component Testing

```typescript
// __tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Best Practices Summary

### Component Design
- Keep components small and focused
- Use composition over inheritance
- Implement proper TypeScript typing
- Follow the standard component structure
- Use meaningful prop names

### State Management
- Use local state for component-specific data
- Use Context for global state
- Implement proper loading and error states
- Use reducers for complex state logic

### Performance
- Memoize expensive calculations
- Use React.memo for pure components
- Implement code splitting for large components
- Optimize re-renders with useCallback

### Accessibility
- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation
- Provide meaningful alt text for images

### Error Handling
- Implement error boundaries
- Handle async errors properly
- Provide user-friendly error messages
- Log errors for debugging