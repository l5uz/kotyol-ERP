# Coding Standards & Conventions - Kotyol ERP

## 1. Naming Conventions

### Files & Folders
- **React Components**: `PascalCase.jsx` (e.g., `StatCard.jsx`, `DashboardLayout.jsx`)
- **Hooks**: `camelCase.js` starting with `use` (e.g., `useDebounce.js`, `useNotification.js`)
- **Services & Utils**: `camelCase.service.js` or `camelCase.utils.js` (e.g., `calculateCost.service.js`)
- **Stores**: `use[Name]Store.js` (e.g., `useAuthStore.js`, `useThemeStore.js`)
- **Constants & Enums**: `camelCase.constants.js` or `camelCase.enum.js`

### Code Symbols
- **Component Names**: `PascalCase`
- **Variable & Function Names**: `camelCase`
- **Constant Values**: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_CURRENCY = 'USD'`)

## 2. Import Ordering Rule
Imports must be structured in the following order, separated by blank lines:

1. React & Core External Libraries (`react`, `react-router-dom`, `axios`, etc.)
2. Third-Party UI & Utilities (`bootstrap-icons`, `dayjs`, `recharts`, `zustand`)
3. Path Aliased Application Imports (`@/shared`, `@/services`, `@/store`, `@/components`, `@/layouts`, `@/hooks`)
4. Stylesheets (`@/styles/custom-bootstrap.css`, etc.)

Example:
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react{'-'}router{'-'}dom';

import { useThemeStore } from '@/store/useThemeStore';
import { calculateCost } from '@/services/calculateCost.service';
import { Button } from '@/components/common/Button/Button';
```

## 3. Formatting & Linting
- Code formatting is enforced via **Prettier** (`.prettierrc`).
- Double quotes for JSX attributes, single quotes for JavaScript strings.
- Semi-colons required at statement ends.
- Indentation: 2 spaces.

## 4. Component Responsibility Guidelines
- Every React component must have a single responsibility.
- Pure calculations must be delegated to `src/services/`.
- Component tree depth should stay shallow. Reusable UI elements must be placed in `src/components/common/`.
