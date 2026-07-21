# System Architecture & Technical Specifications - Kotyol ERP

## Architectural Overview
Kotyol ERP is built as an enterprise-grade, modular web application with strict separation between UI view components, Zustand client session state, and side-effect-free business services.

```
src/
  ├── app/                # Application bootstrap & router
  ├── api/                # Axios instance & token interceptors
  ├── components/common/  # 19 Reusable UI components
  ├── features/           # Isolated ERP domain modules
  │   ├── auth/           # JWT Authentication
  │   ├── dashboard/      # Executive Dashboard
  │   ├── settings/       # System Settings (14 sub-pages)
  │   ├── employees/      # HR & Personnel Foundation
  │   ├── suppliers/      # Supplier Relations & Contacts
  │   ├── products/       # Products, Materials & Inventory Nomenclatures
  │   └── warehouse/      # Warehouse, Movements, Revaluation & Audit
  ├── services/           # Pure business engines & dynamicSettingsService
  ├── shared/             # Reusable enums, validators & React Icons
  └── store/              # Zustand global client UI stores
```

## Icon Standard & Library
Built-in Bootstrap Icons have been replaced with **React Icons** (`react-icons/lu` Lucide and `react-icons/fa` Font Awesome). Icons are exported via `REACT_ERP_ICONS` in `src/shared/icons/index.js`.
