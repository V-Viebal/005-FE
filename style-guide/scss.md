# SCSS Style Guide

This guide covers SCSS/CSS conventions for the project, focusing on Tailwind CSS integration and custom styling patterns.

## Tailwind CSS First Approach

This project primarily uses Tailwind CSS for styling. Custom SCSS should be minimal and follow these guidelines:

### CSS Custom Properties (CSS Variables)

Use CSS custom properties for theming, following the existing pattern:

```scss
// ✅ Good - CSS custom properties for theming
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  // ... other dark theme variables
}
```

### Tailwind Layers

Use Tailwind's layer system for custom styles:

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
      'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90;
    @apply inline-flex items-center justify-center rounded-md px-4 py-2;
    @apply text-sm font-medium transition-colors;
    @apply focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring;
    @apply disabled:pointer-events-none disabled:opacity-50;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

## File Organization

### Main Stylesheet Structure
```scss
// index.css or main.scss
@tailwind base;
@tailwind components;
@tailwind utilities;

// CSS custom properties
@layer base {
  :root {
    // theme variables
  }
  
  .dark {
    // dark theme variables
  }
}

// Base styles
@layer base {
  // global element styles
}

// Component styles (minimal, prefer Tailwind classes)
@layer components {
  // complex component styles that can't be achieved with utilities
}

// Custom utilities
@layer utilities {
  // custom utility classes
}
```

### Component-Specific Styles

Avoid component-specific SCSS files. Use Tailwind classes in components:

```typescript
// ✅ Good - Tailwind classes in component
const Button = ({ variant, size, className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-1',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
          'h-9 px-4 py-2': size === 'default',
          'h-8 px-3 text-xs': size === 'sm',
        },
        className
      )}
      {...props}
    />
  );
};
```

## Naming Conventions

### CSS Custom Properties
- Use kebab-case for custom property names
- Group related properties with common prefixes
- Use semantic names, not visual descriptions

```scss
// ✅ Good
:root {
  --color-primary: 222.2 47.4% 11.2%;
  --color-primary-foreground: 210 40% 98%;
  --color-secondary: 210 40% 96.1%;
  --color-secondary-foreground: 222.2 47.4% 11.2%;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --radius-default: 0.5rem;
}

// ❌ Bad
:root {
  --blue-color: #1e40af;
  --big-padding: 2rem;
  --rounded-corners: 8px;
}
```

### Component Classes (when necessary)
- Use BEM methodology for complex components
- Prefix with component name
- Keep nesting shallow (max 3 levels)

```scss
// ✅ Good - BEM methodology
.modal {
  @apply fixed inset-0 z-50 flex items-center justify-center;
  
  &__backdrop {
    @apply absolute inset-0 bg-black/50;
  }
  
  &__content {
    @apply relative bg-white rounded-lg shadow-lg;
    
    &--large {
      @apply max-w-4xl;
    }
    
    &--small {
      @apply max-w-md;
    }
  }
  
  &__header {
    @apply flex items-center justify-between p-6 border-b;
  }
  
  &__title {
    @apply text-lg font-semibold;
  }
  
  &__close {
    @apply text-gray-400 hover:text-gray-600;
  }
}
```

## Responsive Design

### Mobile-First Approach
Use Tailwind's responsive prefixes:

```typescript
// ✅ Good - Mobile-first responsive design
const ResponsiveComponent = () => {
  return (
    <div className="
      grid grid-cols-1 gap-4
      sm:grid-cols-2 sm:gap-6
      md:grid-cols-3 md:gap-8
      lg:grid-cols-4
      xl:max-w-7xl xl:mx-auto
    ">
      {/* content */}
    </div>
  );
};
```

### Custom Breakpoints (if needed)
```scss
// tailwind.config.js - extend default breakpoints
module.exports = {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
};
```

## Color System

### HSL Color Format
Use HSL format for better manipulation:

```scss
// ✅ Good - HSL format for colors
:root {
  --primary: 222.2 47.4% 11.2%;           // hue saturation lightness
  --primary-foreground: 210 40% 98%;
}

// Usage in Tailwind config
module.exports = {
  theme: {
    colors: {
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
    },
  },
};
```

### Opacity Modifiers
Use Tailwind's opacity modifiers:

```typescript
// ✅ Good - Opacity modifiers
<div className="bg-primary/90 text-primary-foreground/80">
  Content with opacity
</div>
```

## Animation and Transitions

### Tailwind Animations
Prefer Tailwind's built-in animations:

```typescript
// ✅ Good - Tailwind animations
<div className="
  transform transition-all duration-200 ease-in-out
  hover:scale-105 hover:shadow-lg
  focus:outline-none focus:ring-2 focus:ring-primary
">
  Interactive element
</div>
```

### Custom Animations (when necessary)
```scss
@layer utilities {
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
  
  @keyframes slide-in {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
}
```

## Typography

### Font System
```scss
@layer base {
  body {
    font-family: 'Inter var', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 
                 'Droid Sans', 'Helvetica Neue', sans-serif;
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
}
```

### Typography Utilities
```typescript
// ✅ Good - Semantic typography classes
<h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
  Page Title
</h1>

<p className="text-sm text-muted-foreground">
  Supporting text
</p>
```

## Performance Considerations

### Purge Unused Styles
Ensure Tailwind purges unused styles:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // ... rest of config
};
```

### Critical CSS
- Keep critical styles in the main CSS file
- Avoid large custom CSS files
- Use Tailwind's JIT mode for optimal performance

## Anti-Patterns to Avoid

### ❌ Don't use inline styles
```typescript
// ❌ Bad
<div style={{ backgroundColor: 'red', padding: '16px' }}>
  Content
</div>

// ✅ Good
<div className="bg-red-500 p-4">
  Content
</div>
```

### ❌ Don't create unnecessary custom CSS
```scss
// ❌ Bad - can be achieved with Tailwind
.custom-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
}

// ✅ Good - use Tailwind classes
// className="bg-blue-500 text-white px-4 py-2 rounded-md border-0"
```

### ❌ Don't use deep nesting
```scss
// ❌ Bad - too much nesting
.component {
  .header {
    .title {
      .text {
        .span {
          color: red;
        }
      }
    }
  }
}

// ✅ Good - flat structure with Tailwind
// Use className="text-red-500" directly on the element
```

### ❌ Don't override Tailwind defaults unnecessarily
```scss
// ❌ Bad - overriding Tailwind
.text-lg {
  font-size: 20px !important;
}

// ✅ Good - extend Tailwind config instead
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'custom-lg': '20px',
      },
    },
  },
};
```