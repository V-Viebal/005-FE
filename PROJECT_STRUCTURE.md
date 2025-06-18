# Project Structure Documentation

## Overview

This document outlines the reorganized project structure following the established style guide and best practices for maintainability and scalability.

## Directory Structure

```
src/
├── components/
│   ├── layouts/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── index.ts
│   ├── ui/
│   │   ├── particle-background.tsx
│   │   └── index.ts
│   └── index.ts
├── features/
│   └── landing/
│       ├── hero.tsx
│       ├── value-proposition.tsx
│       ├── plans.tsx
│       ├── features.tsx
│       ├── testimonials.tsx
│       ├── faq.tsx
│       ├── final-cta.tsx
│       └── index.ts
├── contexts/
│   └── LanguageContext.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Component Organization

### Layout Components (`components/layouts/`)
Components that define the overall page structure:
- `header.tsx` - Site header with navigation
- `footer.tsx` - Site footer with links and contact info

### UI Components (`components/ui/`)
Reusable UI components that can be used across different features:
- `particle-background.tsx` - Animated particle background effect

### Feature Components (`features/landing/`)
Components specific to the landing page feature:
- `hero.tsx` - Main hero section
- `value-proposition.tsx` - Value proposition section
- `plans.tsx` - Pricing plans section
- `features.tsx` - Features showcase section
- `testimonials.tsx` - Customer testimonials
- `faq.tsx` - Frequently asked questions
- `final-cta.tsx` - Final call-to-action section

## Export Strategy

Each directory contains an `index.ts` file that exports all components and their types:

```typescript
// Named exports with types
export { ComponentName, type ComponentNameProps } from './component-name';
```

## Import Patterns

### Path Aliases
The project uses `@` as an alias for the `src` directory:

```typescript
// Instead of relative imports
import { Component } from '../../../components/ui/component';

// Use absolute imports with alias
import { Component } from '@/components/ui/component';
```

### Centralized Imports
Components can be imported from their respective index files:

```typescript
// Layout components
import { Header, Footer } from '@/components/layouts';

// UI components
import { ParticleBackground } from '@/components/ui';

// Feature components
import { Hero, ValueProposition } from '@/features/landing';

// Or from the main components index
import { Header, Hero, ParticleBackground } from '@/components';
```

## Component Structure

All components follow a consistent structure:

```typescript
// 1. Imports
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// 2. Types
export interface ComponentProps {
  className?: string;
  // other props...
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ 
  className = '',
  ...props 
}) => {
  // Component logic
  return (
    <div className={`base-classes ${className}`}>
      {/* Component content */}
    </div>
  );
};

// 4. Display name
Component.displayName = 'Component';
```

## Configuration Updates

### Vite Configuration
Path aliases are configured in `vite.config.ts`:

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### TypeScript Configuration
Path mapping is configured in `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Benefits of This Structure

1. **Scalability**: Easy to add new features and components
2. **Maintainability**: Clear separation of concerns
3. **Reusability**: UI components can be shared across features
4. **Developer Experience**: Consistent patterns and clear imports
5. **Type Safety**: Full TypeScript support with proper exports
6. **Performance**: Tree-shaking friendly with named exports

## Migration Notes

- All components now use named exports instead of default exports
- Import paths have been updated to use the `@` alias
- Components are organized by their purpose (layout, ui, feature-specific)
- Each component supports a `className` prop for styling flexibility
- All components have proper TypeScript types exported

## Next Steps

For future development:
1. Add new UI components to `components/ui/`
2. Create new feature directories under `features/` as needed
3. Follow the established naming conventions (kebab-case for files)
4. Maintain the export patterns in index files
5. Use the `@` alias for all internal imports