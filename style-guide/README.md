# VieVPS Frontend Style Guide

This comprehensive style guide defines the coding standards, architectural patterns, and best practices for the VieVPS Frontend application built with React, TypeScript, and Vite.

## 📚 Documentation Structure

### [General Guidelines](./general.md)
Core principles, project structure, naming conventions, and architectural patterns for the React application.

**Key Topics:**
- Component-based architecture
- File and directory naming conventions
- Code organization patterns
- Import order standards
- Component structure template
- Performance guidelines
- Error handling strategies
- Accessibility requirements

### [React Patterns](./react.md)
React-specific patterns, component types, hooks, and context management.

**Key Topics:**
- Component types (Page, Layout, Feature, UI)
- Standard component structure
- Custom hooks patterns
- Context providers
- Error boundaries
- Performance optimization
- Code splitting strategies
- Testing patterns

### [TypeScript Standards](./typescript.md)
TypeScript configuration, type definitions, and advanced patterns for type safety.

**Key Topics:**
- TypeScript configuration
- Interface design principles
- Domain type definitions
- Generic components
- Discriminated unions
- Conditional types
- Type guards
- Error handling types
- Service interfaces

### [Testing Guidelines](./testing.md)
Comprehensive testing strategies using Vitest, React Testing Library, and MSW.

**Key Topics:**
- Testing framework setup
- Component testing patterns
- Hook testing strategies
- Context testing
- API mocking with MSW
- Integration testing
- Performance testing
- Test utilities and factories

### [Security Practices](./security.md)
Security best practices for authentication, input validation, and XSS prevention.

**Key Topics:**
- Token management
- Protected routes
- Role-based access control
- Input validation and sanitization
- API security
- Content Security Policy
- XSS prevention
- Environment security

## 🚀 Quick Start

### Component Structure Template

Every React component should follow this standard structure:

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';

// 2. Types
interface ComponentProps {
  // Props interface
}

// 3. Component
const ComponentName: React.FC<ComponentProps> = ({
  // Destructured props
}) => {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 6. Handlers
  const handleAction = () => {
    // Handler logic
  };
  
  // 7. Constants
  const COMPONENT_CONSTANTS = {
    // Component-specific constants
  };
  
  // 8. Render
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Hooks**: `camelCase.ts` (e.g., `useAuth.ts`)
- **Utilities**: `camelCase.ts` (e.g., `formatPrice.ts`)
- **Types**: `PascalCase.ts` (e.g., `User.ts`)
- **Constants**: `UPPER_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`)

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

## 🏗️ Project Architecture

```
src/
├── components/      # Reusable UI components
│   ├── ui/         # Basic UI components (Button, Input, etc.)
│   ├── forms/      # Form components
│   ├── layouts/    # Layout components
│   └── common/     # Common components (Header, Footer, etc.)
├── contexts/        # React Context providers
├── hooks/          # Custom React hooks
├── pages/          # Page-level components
├── services/       # API services and external integrations
├── types/          # TypeScript type definitions
├── utils/          # Utility functions and helpers
├── constants/      # Application constants
├── styles/         # Global styles and theme definitions
├── test/           # Test utilities and setup
├── App.tsx         # Main application component
└── main.tsx        # Application entry point
```

## 🔧 Development Setup

### Required Tools
- **Node.js** (v18+)
- **TypeScript** (v5+)
- **Vite** (v4+)
- **ESLint** with React and TypeScript rules
- **Prettier** for code formatting

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer
- ESLint
- Prettier

## 📋 Code Quality Standards

### ESLint Configuration
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 🧪 Testing Standards

### Coverage Requirements
- **Minimum**: 80% code coverage
- **Components**: Test user interactions and edge cases
- **Hooks**: Test all return values and side effects
- **Utils**: Test all branches and error conditions

### Testing Patterns
```typescript
// Component test example
describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🔒 Security Guidelines

### Key Security Practices
- **Authentication**: Use secure token storage and validation
- **Input Validation**: Sanitize all user inputs
- **XSS Prevention**: Use Content Security Policy and input sanitization
- **CSRF Protection**: Implement CSRF tokens for state-changing operations
- **Environment Security**: Never expose sensitive data in client bundle

## 📈 Performance Guidelines

### Optimization Strategies
- Use `React.memo` for expensive components
- Implement `useCallback` and `useMemo` appropriately
- Use code splitting with `React.lazy`
- Optimize bundle size with tree shaking
- Implement proper loading states

## 🎯 Best Practices Checklist

### Before Code Review
- [ ] Component follows standard structure
- [ ] TypeScript strict mode enabled
- [ ] All props properly typed
- [ ] Error handling implemented
- [ ] Loading states included
- [ ] Accessibility attributes added
- [ ] Tests written and passing
- [ ] No console.log statements
- [ ] No hardcoded values
- [ ] Security considerations addressed

### Before Deployment
- [ ] All tests passing
- [ ] Code coverage meets requirements
- [ ] ESLint and Prettier checks pass
- [ ] Bundle size optimized
- [ ] Environment variables configured
- [ ] Security headers implemented
- [ ] Performance metrics acceptable

## 🤝 Contributing

When contributing to this project:

1. **Follow the style guide** - All code must adhere to these standards
2. **Write tests** - Include unit tests for new components and functions
3. **Update documentation** - Keep the style guide current with any changes
4. **Review security** - Consider security implications of all changes
5. **Performance impact** - Ensure changes don't negatively impact performance

## 📞 Support

For questions about this style guide or implementation:

- Create an issue in the project repository
- Discuss in team meetings
- Refer to the detailed documentation in each section

---

**Remember**: These guidelines exist to ensure code quality, maintainability, and team productivity. When in doubt, prioritize clarity and consistency.