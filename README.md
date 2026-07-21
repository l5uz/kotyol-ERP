# Kotyol Enterprise ERP - Frontend Foundation

A production-ready, highly scalable, enterprise-grade ERP system frontend built for manufacturing operations.

## Tech Stack
- **Framework**: React 18 + Vite (JavaScript)
- **Styling**: Bootstrap 5 + Bootstrap Icons + Custom Enterprise CSS System
- **Routing**: React Router DOM (v6)
- **API Client**: Axios (Interceptor ready, refresh token flow ready, token service)
- **Server State**: TanStack Query (v5)
- **Global Client State**: Zustand (Auth, Sidebar, Theme, Notification, User, Currency)
- **Forms**: React Hook Form
- **Charts & Drag/Drop**: Recharts, dnd-kit, dayjs

## Project Architecture
Feature-based isolated architecture with a dedicated shared layer and pure business calculation services:

```
src/
  ├── api/         # Axios instance, endpoints, interceptors, error handler
  ├── app/         # Entry point, router, providers
  ├── assets/      # Static assets & styles
  ├── components/  # Reusable UI components & Global UI states
  ├── constants/   # Enums, API paths, route constants
  ├── features/    # Isolated business modules (auth, warehouse, production, etc.)
  ├── hooks/       # Custom React hooks
  ├── layouts/     # AuthLayout & DashboardLayout (Compact Sidebar, Navbar, etc.)
  ├── pages/       # Error pages (403, 404, 500, Offline, Unauthorized) & Showcase
  ├── services/    # Independent pure business calculation services
  ├── shared/      # Shared enums, validators, currencies, permissions, helpers
  ├── store/       # Zustand stores
  ├── styles/      # Custom CSS variables, overrides, animations, utilities
  └── utils/       # Formatters, validators, date helpers
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Documentation
Comprehensive architecture, coding standards, roadmap, ADRs, folder layout, API rules, and business workflows are located in the `docs/` folder:
- [architecture.md](file:///home/lite/Documents/projects/FrontendProjects/kotyol/docs/architecture.md)
- [roadmap.md](file:///home/lite/Documents/projects/FrontendProjects/kotyol/docs/roadmap.md)
- [decisions.md](file:///home/lite/Documents/projects/FrontendProjects/kotyol/docs/decisions.md)
- [current_state.md](file:///home/lite/Documents/projects/FrontendProjects/kotyol/docs/current_state.md)
- [coding_standards.md](file:///home/lite/Documents/projects/FrontendProjects/kotyol/docs/coding_standards.md)
- [folder_structure.md](file:///home/lite/Documents/projects/FrontendProjects/kotyol/docs/folder_structure.md)
- [api_rules.md](file:///home/lite/Documents/projects/FrontendProjects/kotyol/docs/api_rules.md)
- [business_flow.md](file:///home/lite/Documents/projects/FrontendProjects/kotyol/docs/business_flow.md)
