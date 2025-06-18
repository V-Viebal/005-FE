# TypeScript Component Style Guide

This guide covers specific conventions for TypeScript and React component development based on the bulletproof React architecture.

## Component Definition

### Function Components
Use function declarations with explicit typing:

```typescript
// ✅ Good
type ButtonProps = {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  onClick?: () => void;
};

const Button = ({ children, variant = 'default', size = 'default', onClick }: ButtonProps) => {
  return (
    <button className={cn(buttonVariants({ variant, size }))} onClick={onClick}>
      {children}
    </button>
  );
};

// ❌ Avoid
const Button = (props: any) => { /* ... */ };
const Button: React.FC<ButtonProps> = (props) => { /* ... */ };
```

### forwardRef Components
For components that need ref forwarding:

```typescript
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div>
        {label && <label>{label}</label>}
        <input
          ref={ref}
          className={cn('input-base', className)}
          {...props}
        />
        {error && <span className="error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

## Type Definitions

### Props Types
- Always define explicit prop types
- Extend HTML element props when appropriate
- Use union types for variants
- Make optional props explicit

```typescript
// ✅ Good - Extending HTML props
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  asChild?: boolean;
};

// ✅ Good - Custom component props
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};
```

### Variant Props with CVA
Use `class-variance-authority` for component variants:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };
```

## Hooks and State Management

### Custom Hooks
```typescript
// ✅ Good - Custom hook with proper typing
type UseDisclosureReturn = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const useDisclosure = (initialState = false): UseDisclosureReturn => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle };
};
```

### State with TypeScript
```typescript
// ✅ Good - Explicit state typing
type FormState = {
  email: string;
  password: string;
  isSubmitting: boolean;
  errors: Record<string, string>;
};

const [formState, setFormState] = useState<FormState>({
  email: '',
  password: '',
  isSubmitting: false,
  errors: {},
});

// ✅ Good - Union type for status
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
const [status, setStatus] = useState<LoadingState>('idle');
```

## Event Handlers

### Typing Event Handlers
```typescript
// ✅ Good - Proper event typing
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  // handle form submission
};

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    handleSubmit();
  }
};

// ✅ Good - Custom event handlers
type SelectOption = {
  value: string;
  label: string;
};

const handleSelectChange = (option: SelectOption) => {
  setSelectedOption(option);
};
```

## API Integration

### Query and Mutation Types
```typescript
// ✅ Good - API response typing
type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
};

// ✅ Good - Query configuration
type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

type MutationConfig<MutationFnType extends (...args: any) => Promise<any>> = 
  UseMutationOptions<
    ApiFnReturnType<MutationFnType>,
    Error,
    Parameters<MutationFnType>[0]
  >;
```

## Error Handling

### Error Boundaries
```typescript
type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

## Utility Functions

### Type Guards
```typescript
// ✅ Good - Type guards for runtime checking
const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

const isUser = (value: unknown): value is User => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value
  );
};
```

### Generic Utilities
```typescript
// ✅ Good - Generic utility functions
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
```

## Testing Types

### Component Testing
```typescript
// ✅ Good - Test utilities with proper typing
type RenderOptions = {
  initialEntries?: string[];
  user?: User;
};

const renderWithProviders = (
  ui: React.ReactElement,
  options: RenderOptions = {}
) => {
  const { initialEntries = ['/'], user } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders initialEntries={initialEntries} user={user}>
        {children}
      </TestProviders>
    ),
  });
};
```

## Anti-Patterns to Avoid

### ❌ Don't use `any`
```typescript
// ❌ Bad
const handleData = (data: any) => {
  // loses all type safety
};

// ✅ Good
const handleData = <T>(data: T) => {
  // maintains type safety
};
```

### ❌ Don't use function components with React.FC
```typescript
// ❌ Bad
const Component: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};

// ✅ Good
const Component = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};
```

### ❌ Don't inline complex types
```typescript
// ❌ Bad
const Component = ({ 
  user 
}: { 
  user: { id: string; name: string; email: string; role: 'admin' | 'user' } 
}) => {
  // component implementation
};

// ✅ Good
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

const Component = ({ user }: { user: User }) => {
  // component implementation
};
```