# VieVPS Frontend - Testing Style Guide

## Testing Framework Setup

### Vitest Configuration

#### vitest.config.ts
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

#### Test Setup (src/test/setup.ts)
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {}
  })
});
```

## Testing Patterns

### Component Testing

#### Basic Component Test
```typescript
// __tests__/components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('Loading');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button</Button>);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
```

#### Form Component Test
```typescript
// __tests__/components/auth/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock the auth hook
const mockLogin = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoading: false
  })
}));

const renderLoginForm = (props = {}) => {
  return render(
    <AuthProvider>
      <LoginForm {...props} />
    </AuthProvider>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  it('renders all form fields', () => {
    renderLoginForm();
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    renderLoginForm();
    
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    });
    
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('validates password length', async () => {
    const user = userEvent.setup();
    renderLoginForm();
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.type(passwordInput, '123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    renderLoginForm({ onSuccess });
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('handles login error', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    renderLoginForm();
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
```

### Hook Testing

#### Custom Hook Test
```typescript
// __tests__/hooks/useAuth.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';

// Mock the auth service
vi.mock('@/services/authService');
const mockAuthService = vi.mocked(authService);

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  it('logs in user successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser'
    };
    
    mockAuthService.login.mockResolvedValueOnce(mockUser);
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('handles login error', async () => {
    mockAuthService.login.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    const { result } = renderHook(() => useAuth());
    
    await expect(async () => {
      await act(async () => {
        await result.current.login('test@example.com', 'wrongpassword');
      });
    }).rejects.toThrow('Invalid credentials');
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs out user', async () => {
    const mockUser = { id: '1', email: 'test@example.com', username: 'testuser' };
    mockAuthService.login.mockResolvedValueOnce(mockUser);
    
    const { result } = renderHook(() => useAuth());
    
    // Login first
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    
    // Then logout
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
```

### Context Testing

#### Context Provider Test
```typescript
// __tests__/contexts/ThemeContext.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

const TestComponent = () => {
  const { theme, actualTheme, setTheme } = useTheme();
  
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="actual-theme">{actualTheme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('system')}>Set System</button>
    </div>
  );
};

const renderWithThemeProvider = (defaultTheme?: 'light' | 'dark' | 'system') => {
  return render(
    <ThemeProvider defaultTheme={defaultTheme}>
      <TestComponent />
    </ThemeProvider>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    // Reset document classes
    document.documentElement.className = '';
  });

  it('provides default theme', () => {
    renderWithThemeProvider();
    
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
  });

  it('allows setting custom default theme', () => {
    renderWithThemeProvider('dark');
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('dark');
  });

  it('changes theme when setTheme is called', () => {
    renderWithThemeProvider();
    
    fireEvent.click(screen.getByText('Set Dark'));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    
    fireEvent.click(screen.getByText('Set Light'));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('applies theme classes to document', () => {
    renderWithThemeProvider();
    
    fireEvent.click(screen.getByText('Set Dark'));
    expect(document.documentElement).toHaveClass('dark');
    
    fireEvent.click(screen.getByText('Set Light'));
    expect(document.documentElement).toHaveClass('light');
    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
    
    consoleSpy.mockRestore();
  });
});
```

## Mock Strategies

### API Mocking with MSW

#### MSW Setup
```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';
import { User, VPS, VPSPlan } from '@/types';

const API_BASE_URL = 'http://localhost:3001/api';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

const mockVPSPlans: VPSPlan[] = [
  {
    id: '1',
    name: 'Basic',
    cpu: 1,
    ram: 1,
    storage: 25,
    bandwidth: 1000,
    price: 5.99,
    currency: 'USD'
  }
];

export const handlers = [
  // Auth endpoints
  rest.post(`${API_BASE_URL}/auth/login`, (req, res, ctx) => {
    const { email, password } = req.body as { email: string; password: string };
    
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          data: {
            user: mockUsers[0],
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token'
          }
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        message: 'Invalid credentials'
      })
    );
  }),

  rest.post(`${API_BASE_URL}/auth/logout`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true, message: 'Logged out successfully' })
    );
  }),

  // User endpoints
  rest.get(`${API_BASE_URL}/users`, (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1;
    const limit = Number(req.url.searchParams.get('limit')) || 10;
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          users: mockUsers,
          pagination: {
            page,
            limit,
            total: mockUsers.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        }
      })
    );
  }),

  rest.get(`${API_BASE_URL}/users/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      return res(
        ctx.status(404),
        ctx.json({ success: false, message: 'User not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({ success: true, data: user })
    );
  }),

  // VPS Plans endpoints
  rest.get(`${API_BASE_URL}/plans`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true, data: mockVPSPlans })
    );
  }),

  // Error simulation
  rest.get(`${API_BASE_URL}/error`, (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ success: false, message: 'Internal server error' })
    );
  })
];
```

```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### Component Mocking

#### Mock External Components
```typescript
// __tests__/components/Dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from '@/pages/Dashboard';

// Mock child components
vi.mock('@/components/dashboard/StatsCards', () => ({
  StatsCards: () => <div data-testid="stats-cards">Stats Cards</div>
}));

vi.mock('@/components/dashboard/RecentActivity', () => ({
  RecentActivity: () => <div data-testid="recent-activity">Recent Activity</div>
}));

vi.mock('@/components/layouts/DashboardLayout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  )
}));

describe('Dashboard', () => {
  it('renders all dashboard components', () => {
    render(<Dashboard />);
    
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    expect(screen.getByTestId('stats-cards')).toBeInTheDocument();
    expect(screen.getByTestId('recent-activity')).toBeInTheDocument();
  });
});
```

## Integration Testing

### Page Integration Test
```typescript
// __tests__/integration/UserManagement.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserManagement } from '@/pages/UserManagement';
import { AuthProvider } from '@/contexts/AuthContext';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const renderUserManagement = () => {
  const queryClient = createTestQueryClient();
  
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UserManagement />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('UserManagement Integration', () => {
  beforeEach(() => {
    // Reset any global state
  });

  it('loads and displays users', async () => {
    renderUserManagement();
    
    // Should show loading state initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('john_doe')).toBeInTheDocument();
    });
    
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('allows creating a new user', async () => {
    const user = userEvent.setup();
    renderUserManagement();
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('john_doe')).toBeInTheDocument();
    });
    
    // Click create user button
    await user.click(screen.getByText('Create User'));
    
    // Fill out form
    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.type(screen.getByLabelText('Username'), 'newuser');
    await user.type(screen.getByLabelText('First Name'), 'New');
    await user.type(screen.getByLabelText('Last Name'), 'User');
    await user.type(screen.getByLabelText('Password'), 'password123');
    
    // Submit form
    await user.click(screen.getByText('Create'));
    
    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('User created successfully')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    server.use(
      rest.get('http://localhost:3001/api/users', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ success: false, message: 'Server error' })
        );
      })
    );
    
    renderUserManagement();
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load users')).toBeInTheDocument();
    });
  });
});
```

## Test Utilities

### Custom Render Function
```typescript
// src/test/utils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  queryClient?: QueryClient;
}

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0
    },
    mutations: {
      retry: false
    }
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {} // Suppress error logs in tests
  }
});

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    initialEntries = ['/'],
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient
  };
};

// Re-export everything
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
```

### Test Data Factories
```typescript
// src/test/factories.ts
import { User, VPS, VPSPlan } from '@/types';

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
  isActive: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  ...overrides
});

export const createMockVPS = (overrides: Partial<VPS> = {}): VPS => ({
  id: '1',
  name: 'Test VPS',
  plan: createMockVPSPlan(),
  status: 'running',
  ipAddress: '192.168.1.1',
  operatingSystem: {
    id: '1',
    name: 'Ubuntu',
    version: '22.04',
    family: 'linux'
  },
  resources: {
    cpu: { cores: 1, usage: 25 },
    memory: { total: 1, used: 0.5, usage: 50 },
    storage: { total: 25, used: 10, usage: 40 },
    network: { bandwidthUsed: 100, bandwidthLimit: 1000 }
  },
  location: {
    id: '1',
    name: 'New York',
    country: 'US',
    city: 'New York',
    flag: '🇺🇸'
  },
  createdAt: '2023-01-01T00:00:00Z',
  expiresAt: '2024-01-01T00:00:00Z',
  ownerId: '1',
  ...overrides
});

export const createMockVPSPlan = (overrides: Partial<VPSPlan> = {}): VPSPlan => ({
  id: '1',
  name: 'Basic',
  cpu: 1,
  ram: 1,
  storage: 25,
  bandwidth: 1000,
  price: 5.99,
  currency: 'USD',
  ...overrides
});
```

## Performance Testing

### Component Performance Test
```typescript
// __tests__/performance/DataTable.test.tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataTable } from '@/components/ui/DataTable';
import { createMockUser } from '@/test/factories';

describe('DataTable Performance', () => {
  it('renders large datasets efficiently', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => 
      createMockUser({ id: i.toString(), username: `user${i}` })
    );
    
    const columns = [
      { key: 'username' as const, title: 'Username' },
      { key: 'email' as const, title: 'Email' }
    ];
    
    const startTime = performance.now();
    
    render(
      <DataTable
        data={largeDataset}
        columns={columns}
      />
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within reasonable time (adjust threshold as needed)
    expect(renderTime).toBeLessThan(100); // 100ms
  });
});
```

## Best Practices

### Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Follow the AAA pattern: Arrange, Act, Assert
- Keep tests focused and test one thing at a time

### Mocking Guidelines
- Mock external dependencies, not internal logic
- Use MSW for API mocking instead of mocking fetch/axios
- Mock at the boundary (services, not hooks)
- Reset mocks between tests

### Assertions
- Use specific assertions (`toHaveTextContent` vs `toBeInTheDocument`)
- Test user-visible behavior, not implementation details
- Use `waitFor` for async operations
- Test error states and edge cases

### Coverage Goals
- Aim for 80%+ code coverage
- Focus on critical business logic
- Don't chase 100% coverage at the expense of test quality
- Use coverage reports to identify untested code paths

### Performance
- Use `vi.mock` for expensive operations
- Clean up after tests (cleanup, resetHandlers)
- Use test-specific query clients
- Avoid testing implementation details