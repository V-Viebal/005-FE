# VieVPS Frontend - General Style Guide

## Project Overview

This style guide defines the coding standards and architectural patterns for the VieVPS Frontend application, built with React, TypeScript, and Vite.

## Architecture Pattern

### Component-Based Architecture
The project follows a component-based architecture with clear separation of concerns:

```
src/
├── components/      # Reusable UI components
├── contexts/        # React Context providers
├── hooks/          # Custom React hooks
├── pages/          # Page-level components
├── services/       # API services and external integrations
├── types/          # TypeScript type definitions
├── utils/          # Utility functions and helpers
├── constants/      # Application constants
├── styles/         # Global styles and theme definitions
├── App.tsx         # Main application component
└── main.tsx        # Application entry point
```

### Component Hierarchy
- **Pages** → **Layout Components** → **Feature Components** → **UI Components**
- Each component should have a single responsibility
- Prefer composition over inheritance
- Use React Context for global state management

## File Naming Conventions

### Files and Directories
- **Components**: PascalCase (`Header.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase starting with "use" (`useAuth.ts`, `useLocalStorage.ts`)
- **Utilities**: camelCase (`formatPrice.ts`, `validateEmail.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`, `THEME_COLORS.ts`)
- **Types**: PascalCase (`User.ts`, `ApiResponse.ts`)
- **Directories**: camelCase (`components`, `contexts`, `utils`)

### Component Structure
- **Component files**: Always `.tsx` for components with JSX
- **Hook files**: `.ts` for custom hooks without JSX
- **Type files**: `.ts` for type definitions
- **Index files**: `index.ts` for barrel exports

### Variables and Functions
- **Variables**: camelCase (`userData`, `isLoading`)
- **Functions**: camelCase (`handleSubmit`, `validateForm`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`, `DEFAULT_TIMEOUT`)
- **Component props**: camelCase (`onClick`, `isDisabled`)
- **CSS classes**: kebab-case (`btn-primary`, `form-container`)

## Code Organization

### Import Order
```typescript
// 1. React and React-related imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Third-party libraries
import axios from 'axios';
import { toast } from 'react-toastify';

// 3. Internal imports (absolute paths)
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { User } from '@/types/User';

// 4. Relative imports
import './ComponentName.css';
```

### Component Structure Template
```typescript
// Types
interface ComponentNameProps {
  // Props interface
}

// Component
const ComponentName: React.FC<ComponentNameProps> = ({
  // Destructured props
}) => {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Handlers
  const handleAction = () => {
    // Handler logic
  };
  
  // Constants
  const COMPONENT_CONSTANTS = {
    // Component-specific constants
  };
  
  // Render
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

## Component Design Principles

### Single Responsibility
- Each component should have one clear purpose
- Break down complex components into smaller, focused ones
- Use composition to combine simple components

### Props Interface Design
```typescript
// ✅ Good - Clear, typed props
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

// ❌ Bad - Unclear, untyped props
interface ButtonProps {
  text: any;
  type: string;
  action: Function;
}
```

### State Management
- Use `useState` for local component state
- Use `useReducer` for complex state logic
- Use React Context for global state
- Consider external state management (Zustand, Redux) for complex applications

## Performance Guidelines

### React.memo Usage
```typescript
// ✅ Good - Memoize expensive components
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <div>{/* Expensive rendering */}</div>;
});

// ✅ Good - Custom comparison function
const OptimizedComponent = React.memo<Props>(
  ({ user, settings }) => {
    return <div>{/* Component content */}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id;
  }
);
```

### useCallback and useMemo
```typescript
// ✅ Good - Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ✅ Good - Memoize event handlers
const handleClick = useCallback(() => {
  onItemClick(item.id);
}, [item.id, onItemClick]);
```

## Error Handling

### Error Boundaries
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### Async Error Handling
```typescript
// ✅ Good - Proper async error handling
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.getData();
    setData(response.data);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Unknown error');
    toast.error('Failed to fetch data');
  } finally {
    setLoading(false);
  }
};
```

## Accessibility Guidelines

### Semantic HTML
```typescript
// ✅ Good - Semantic HTML structure
return (
  <main>
    <header>
      <h1>Page Title</h1>
      <nav aria-label="Main navigation">
        {/* Navigation items */}
      </nav>
    </header>
    <section aria-labelledby="content-heading">
      <h2 id="content-heading">Content Section</h2>
      {/* Content */}
    </section>
  </main>
);
```

### ARIA Attributes
```typescript
// ✅ Good - Proper ARIA usage
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  onClick={handleClose}
>
  <CloseIcon aria-hidden="true" />
</button>
```

## Environment Configuration

### Environment Variables
- Use `.env` files for configuration
- Provide `.env.example` with all required variables
- Never commit sensitive data to version control
- Use proper defaults for development

```typescript
// ✅ Good
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const isDevelopment = import.meta.env.DEV;
```

## Code Quality Standards

### ESLint Configuration
- Use strict ESLint rules for consistency
- Configure Prettier for code formatting
- Use TypeScript strict mode
- Implement pre-commit hooks

### Documentation
- Document complex components with JSDoc
- Maintain README files for major features
- Use TypeScript for self-documenting code
- Include usage examples in component documentation

## Best Practices Summary

### Do's ✅
- Use TypeScript strict mode
- Implement proper error boundaries
- Follow React hooks rules
- Use semantic HTML and ARIA attributes
- Implement proper loading and error states
- Use React.memo for performance optimization
- Follow consistent naming conventions
- Write self-documenting code

### Don'ts ❌
- Don't use `any` type
- Don't mutate props or state directly
- Don't use array indices as keys
- Don't ignore accessibility requirements
- Don't skip error handling
- Don't use inline styles for complex styling
- Don't create deeply nested component hierarchies
- Don't ignore React warnings in console