# VieVPS Frontend - TypeScript Style Guide

## TypeScript Configuration

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Type Definitions

### Interface Design Principles

#### Component Props Interfaces
```typescript
// ✅ Good - Clear, specific interface
interface UserCardProps {
  user: User;
  showEmail?: boolean;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  className?: string;
}

// ❌ Bad - Vague, untyped interface
interface UserCardProps {
  data: any;
  config: object;
  handlers: any;
}
```

#### Extending HTML Attributes
```typescript
// ✅ Good - Extending native HTML attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
```

### Domain Types

#### User Types
```typescript
// types/User.ts
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'user' | 'moderator';

export interface CreateUserRequest {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'password'>> {
  currentPassword?: string;
  newPassword?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}
```

#### API Response Types
```typescript
// types/Api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

#### VPS Types
```typescript
// types/VPS.ts
export interface VPS {
  id: string;
  name: string;
  plan: VPSPlan;
  status: VPSStatus;
  ipAddress: string;
  operatingSystem: OperatingSystem;
  resources: VPSResources;
  location: DataCenter;
  createdAt: string;
  expiresAt: string;
  ownerId: string;
}

export type VPSStatus = 
  | 'creating' 
  | 'running' 
  | 'stopped' 
  | 'suspended' 
  | 'terminated' 
  | 'error';

export interface VPSPlan {
  id: string;
  name: string;
  cpu: number;
  ram: number; // in GB
  storage: number; // in GB
  bandwidth: number; // in GB
  price: number; // monthly price
  currency: string;
}

export interface VPSResources {
  cpu: {
    cores: number;
    usage: number; // percentage
  };
  memory: {
    total: number; // in GB
    used: number; // in GB
    usage: number; // percentage
  };
  storage: {
    total: number; // in GB
    used: number; // in GB
    usage: number; // percentage
  };
  network: {
    bandwidthUsed: number; // in GB
    bandwidthLimit: number; // in GB
  };
}

export interface OperatingSystem {
  id: string;
  name: string;
  version: string;
  family: 'linux' | 'windows';
  icon?: string;
}

export interface DataCenter {
  id: string;
  name: string;
  country: string;
  city: string;
  flag: string;
}
```

### Utility Types

#### Form Types
```typescript
// types/Forms.ts
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
}

export interface FormState<T extends Record<string, any>> {
  fields: {
    [K in keyof T]: FormField<T[K]>;
  };
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type FormValues<T> = {
  [K in keyof T]: T[K];
};

// Example usage
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

type LoginFormState = FormState<LoginFormData>;
type LoginFormErrors = FormErrors<LoginFormData>;
```

#### Hook Return Types
```typescript
// types/Hooks.ts
export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}
```

## Advanced TypeScript Patterns

### Generic Components
```typescript
// components/ui/DataTable.tsx
interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
}

interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onRowClick,
  onSort
}: DataTableProps<T>) => {
  // Component implementation
};

// Usage
const UserTable = () => {
  const columns: Column<User>[] = [
    { key: 'username', title: 'Username', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    {
      key: 'role',
      title: 'Role',
      render: (role) => <Badge variant={role}>{role}</Badge>
    }
  ];

  return (
    <DataTable<User>
      data={users}
      columns={columns}
      onRowClick={handleUserClick}
    />
  );
};
```

### Discriminated Unions
```typescript
// types/Notifications.ts
interface BaseNotification {
  id: string;
  title: string;
  createdAt: string;
  read: boolean;
}

interface InfoNotification extends BaseNotification {
  type: 'info';
  message: string;
}

interface WarningNotification extends BaseNotification {
  type: 'warning';
  message: string;
  action?: {
    label: string;
    url: string;
  };
}

interface ErrorNotification extends BaseNotification {
  type: 'error';
  error: string;
  retryAction?: () => void;
}

interface SuccessNotification extends BaseNotification {
  type: 'success';
  message: string;
  autoClose?: boolean;
}

export type Notification = 
  | InfoNotification 
  | WarningNotification 
  | ErrorNotification 
  | SuccessNotification;

// Usage with type guards
const NotificationComponent: React.FC<{ notification: Notification }> = ({ notification }) => {
  switch (notification.type) {
    case 'info':
      return <InfoAlert message={notification.message} />;
    case 'warning':
      return (
        <WarningAlert 
          message={notification.message} 
          action={notification.action} 
        />
      );
    case 'error':
      return (
        <ErrorAlert 
          error={notification.error} 
          onRetry={notification.retryAction} 
        />
      );
    case 'success':
      return (
        <SuccessAlert 
          message={notification.message} 
          autoClose={notification.autoClose} 
        />
      );
    default:
      // TypeScript ensures this is never reached
      const _exhaustive: never = notification;
      return null;
  }
};
```

### Conditional Types
```typescript
// types/Utils.ts

// Make specific fields optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific fields required
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Extract function parameters
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

// Extract function return type
export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

// Deep partial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Example usage
interface CreateVPSRequest {
  name: string;
  planId: string;
  osId: string;
  datacenterId: string;
  sshKeys?: string[];
}

// Make sshKeys required
type CreateVPSWithSSH = RequiredBy<CreateVPSRequest, 'sshKeys'>;

// Make name and planId optional for updates
type UpdateVPSRequest = PartialBy<CreateVPSRequest, 'name' | 'planId'>;
```

### Type Guards
```typescript
// utils/typeGuards.ts

// Basic type guards
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

// Domain-specific type guards
export const isUser = (value: unknown): value is User => {
  return (
    isObject(value) &&
    isString(value.id) &&
    isString(value.email) &&
    isString(value.username)
  );
};

export const isVPSStatus = (value: unknown): value is VPSStatus => {
  return (
    isString(value) &&
    ['creating', 'running', 'stopped', 'suspended', 'terminated', 'error'].includes(value)
  );
};

// API response type guard
export const isApiResponse = <T>(value: unknown, dataGuard: (data: unknown) => data is T): value is ApiResponse<T> => {
  return (
    isObject(value) &&
    typeof value.success === 'boolean' &&
    (value.success ? dataGuard(value.data) : true)
  );
};

// Usage
const handleApiResponse = (response: unknown) => {
  if (isApiResponse(response, isUser)) {
    // response.data is now typed as User
    console.log(response.data.username);
  }
};
```

## Error Handling Types

### Error Types
```typescript
// types/Errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400, { fields });
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, public originalError?: Error) {
    super(message, 'NETWORK_ERROR', 0, { originalError });
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

// Error result type
export type Result<T, E = AppError> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Usage
const fetchUser = async (id: string): Promise<Result<User>> => {
  try {
    const user = await userService.getById(id);
    return { success: true, data: user };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error };
    }
    return { 
      success: false, 
      error: new AppError('Unknown error occurred', 'UNKNOWN_ERROR') 
    };
  }
};
```

## Service Types

### API Service Types
```typescript
// services/types.ts
export interface ApiServiceConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers?: Record<string, string>;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ApiService {
  get<T>(url: string, config?: Partial<RequestConfig>): Promise<T>;
  post<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T>;
  put<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T>;
  delete<T>(url: string, config?: Partial<RequestConfig>): Promise<T>;
  patch<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T>;
}

// Service implementation type
export interface UserService {
  getAll(params?: PaginationParams): Promise<PaginatedResponse<User>>;
  getById(id: string): Promise<User>;
  create(data: CreateUserRequest): Promise<User>;
  update(id: string, data: UpdateUserRequest): Promise<User>;
  delete(id: string): Promise<void>;
  changePassword(id: string, oldPassword: string, newPassword: string): Promise<void>;
}
```

## Best Practices

### Type Safety Rules

#### Avoid `any`
```typescript
// ❌ Bad
const processData = (data: any) => {
  return data.someProperty;
};

// ✅ Good
interface ProcessableData {
  someProperty: string;
}

const processData = (data: ProcessableData) => {
  return data.someProperty;
};

// ✅ Good - When type is truly unknown
const processUnknownData = (data: unknown) => {
  if (isObject(data) && 'someProperty' in data) {
    return data.someProperty;
  }
  throw new Error('Invalid data format');
};
```

#### Use Strict Null Checks
```typescript
// ✅ Good - Handle null/undefined explicitly
interface UserProfileProps {
  user: User | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div>
      <h1>{user.username}</h1>
      <p>{user.email}</p>
    </div>
  );
};
```

#### Prefer Union Types over Enums
```typescript
// ✅ Good - Union types
export type Theme = 'light' | 'dark' | 'auto';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

// ❌ Avoid - Enums (unless you need reverse mapping)
enum Theme {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto'
}
```

#### Use `const` Assertions
```typescript
// ✅ Good - Const assertion for immutable data
const BUTTON_VARIANTS = ['primary', 'secondary', 'danger'] as const;
type ButtonVariant = typeof BUTTON_VARIANTS[number]; // 'primary' | 'secondary' | 'danger'

const API_ENDPOINTS = {
  USERS: '/api/users',
  VPS: '/api/vps',
  PLANS: '/api/plans'
} as const;

type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
```

### Documentation with JSDoc
```typescript
/**
 * Formats a price value with currency symbol and proper decimal places
 * @param amount - The price amount in cents
 * @param currency - The currency code (e.g., 'USD', 'EUR')
 * @param locale - The locale for formatting (defaults to 'en-US')
 * @returns Formatted price string
 * @example
 * ```typescript
 * formatPrice(1299, 'USD') // '$12.99'
 * formatPrice(2500, 'EUR', 'de-DE') // '25,00 €'
 * ```
 */
export const formatPrice = (
  amount: number,
  currency: string,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount / 100);
};
```

## Summary

### Do's ✅
- Use strict TypeScript configuration
- Define clear, specific interfaces
- Use union types for constrained values
- Implement proper type guards
- Handle null/undefined explicitly
- Use generic types for reusable components
- Document complex types with JSDoc
- Prefer composition over inheritance

### Don'ts ❌
- Don't use `any` type
- Don't ignore TypeScript errors
- Don't use `Function` type (use specific function signatures)
- Don't mutate readonly types
- Don't use non-null assertion (`!`) unless absolutely necessary
- Don't create overly complex type hierarchies
- Don't use `object` type (use specific interfaces)
- Don't ignore strict null checks