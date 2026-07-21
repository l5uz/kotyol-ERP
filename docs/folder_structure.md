# Folder Structure Directory Guide - Kotyol ERP

```
kotyol/
├── docs/                           # Centralized technical documentation
│   ├── architecture.md             # System layers & data flow
│   ├── roadmap.md                  # Milestone progress tracking
│   ├── decisions.md                # Architecture Decision Records (ADRs)
│   ├── current_state.md            # Live implementation status
│   ├── coding_standards.md         # Conventions & formatting guidelines
│   ├── folder_structure.md         # Directory layout documentation
│   ├── api_rules.md                # Axios & contract specifications
│   └── business_flow.md            # ERP enterprise workflows
│
└── src/
    ├── api/                        # Central HTTP client infrastructure
    │   ├── axiosInstance.js        # Configured Axios instance with interceptors
    │   ├── endpoints.js            # Standardized API URI definitions
    │   ├── errorHandler.js         # Unified error normalizer
    │   └── tokenService.js         # Access & Refresh token local storage manager
    │
    ├── app/                        # Application bootstrap & entry
    │   ├── main.jsx                # DOM root element mounting
    │   ├── App.jsx                 # Top-level application shell
    │   ├── providers/              # QueryClient, Theme, Notification providers
    │   └── router/                 # React Router DOM routes & Auth guards
    │
    ├── assets/                     # Branding assets, SVG icons, static images
    │
    ├── components/                 # Global UI component library
    │   ├── common/                 # Reusable atomic UI elements (Button, Card, Table...)
    │   └── index.js                # Re-exports for component library
    │
    ├── constants/                  # Application-wide constants & storage keys
    │
    ├── features/                   # Modular business domain features
    │   ├── auth/                   # Authentication & user session
    │   ├── dashboard/              # Analytics & executive metrics
    │   ├── warehouse/              # Inventory & materials management
    │   ├── production/             # BOM, scheduling & manufacturing
    │   ├── sales/                  # Orders, invoices & CRM
    │   ├── finance/                # General ledger, payroll & accounts
    │   ├── employees/              # HR, attendance & departments
    │   └── customers/              # Customer directory & contacts
    │
    ├── hooks/                      # Custom shared React hooks (useDebounce, useToggle...)
    │
    ├── layouts/                    # Structure layouts
    │   ├── AuthLayout/             # Public authentication card layout
    │   └── DashboardLayout/        # Modern ERP Layout with compact Sidebar & Navbar
    │
    ├── pages/                      # Standalone error pages & foundation showcase
    │   └── errors/                 # 403, 404, 500, Offline, Unauthorized
    │
    ├── services/                   # Independent pure business calculation domain logic
    │   ├── calculateCost.service.js
    │   ├── calculateProfit.service.js
    │   ├── calculateRecipe.service.js
    │   ├── calculateSalary.service.js
    │   ├── currencyConverter.service.js
    │   └── inventoryCalculator.service.js
    │
    ├── shared/                     # Cross-module shared layer
    │   ├── currencies/             # Supported currencies & format specs
    │   ├── enums/                  # Status, Roles, HTTP status enums
    │   ├── helpers/                # General shared helper utilities
    │   ├── icons/                  # Bootstrap Icon mapper constants
    │   ├── permissions/            # RBAC permission matrix definitions
    │   └── validators/             # Shared validation rules
    │
    ├── store/                      # Zustand client session stores
    │   ├── useAuthStore.js
    │   ├── useCurrencyStore.js
    │   ├── useNotificationStore.js
    │   ├── useSidebarStore.js
    │   ├── useThemeStore.js
    │   └── useUserStore.js
    │
    ├── styles/                     # Enterprise CSS design system
    │   ├── animations.css          # Subtle UI animations
    │   ├── custom-bootstrap.css    # Customized Bootstrap 5 component overrides
    │   ├── global.css              # Reset & global styles
    │   ├── utilities.css           # Utility classes
    │   └── variables.css           # Custom CSS variables & color tokens
    │
    └── utils/                      # Helper formatters, date transformers, validators
```
