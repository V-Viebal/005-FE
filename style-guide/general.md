# General Style Guide

This document outlines the general coding standards and conventions for the project, based on the bulletproof React architecture.

## File and Directory Naming

### Files
- Use **kebab-case** for all file names
- TypeScript/React files: `.tsx` for components, `.ts` for utilities
- Test files: `*.test.tsx` or `*.test.ts`
- Story files: `*.stories.tsx`
- Examples: `dashboard-layout.tsx`, `api-client.ts`, `button.test.tsx`

### Directories
- Use **kebab-case** for all directory names
- Group related functionality together
- Examples: `components/ui/button/`, `features/discussions/`

## Project Structure

### Component Organization
```
components/
├── ui/           # Reusable UI components
├── layouts/      # Layout components
├── seo/          # SEO-related components
└── errors/       # Error handling components
```

### Feature Organization
```
features/
├── auth/
├── discussions/
├── comments/
└── users/
```

### Export Patterns
- Each component directory should have an `index.ts` file
- Use named exports: `export * from './component-name'`
- Avoid default exports for better tree-shaking

## Import Organization

Follow this order (enforced by ESLint):
1. External libraries (React, third-party packages)
2. Internal imports with absolute paths (`@/`)
3. Relative imports
4. Type-only imports at the end

```typescript
import React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { cn } from '@/utils/cn';

import { LocalComponent } from './local-component';

import type { ComponentProps } from './types';
```

## Code Formatting

### Prettier Configuration
- Single quotes for strings
- Trailing commas everywhere
- 80 character line width
- 2 spaces for indentation
- No tabs

### ESLint Rules
- Strict TypeScript rules enabled
- React hooks rules enforced
- Import order and restrictions enforced
- Accessibility rules (jsx-a11y)
- Testing library rules

## TypeScript Guidelines

### Type Definitions
- Use `type` for object shapes and unions
- Use `interface` for extensible contracts
- Prefer explicit return types for functions
- Use generic constraints when appropriate

```typescript
// Good
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
};

// Component with explicit return type
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    // implementation
  }
);
```

## Component Guidelines

### Component Structure
1. Imports (external, internal, relative, types)
2. Type definitions
3. Constants and utilities
4. Main component
5. Default export (if needed)

### Props and State
- Use TypeScript for all props
- Destructure props in function signature
- Use meaningful prop names
- Provide default values when appropriate

### Event Handlers
- Prefix with `handle` or `on`
- Use arrow functions for inline handlers
- Extract complex handlers to separate functions

```typescript
const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  // handle submission
};

return (
  <form onSubmit={handleSubmit}>
    <button onClick={() => setOpen(false)}>Close</button>
  </form>
);
```

## Error Handling

- Use Error Boundaries for component-level error handling
- Implement proper loading and error states
- Use try-catch for async operations
- Provide meaningful error messages

## Performance Guidelines

- Use React.memo for expensive components
- Implement proper dependency arrays for hooks
- Avoid inline object/array creation in render
- Use callback hooks for expensive computations

## Testing

- Write tests for all components and utilities
- Use React Testing Library for component tests
- Follow AAA pattern (Arrange, Act, Assert)
- Test user interactions, not implementation details

## Documentation

- Use JSDoc comments for complex functions
- Write clear commit messages
- Update README files when adding features
- Document breaking changes

## Security

- Sanitize user input (use DOMPurify for HTML)
- Validate all external data
- Use environment variables for sensitive data
- Implement proper authentication checks

## Accessibility

- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast