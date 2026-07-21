# Architecture Decision Records (ADR) - Kotyol ERP

## ADR 001: Selection of Vanilla CSS over Utility Frameworks (Tailwind)
- **Status**: Accepted
- **Decision**: Use Bootstrap 5 as base layout/grid system and layer custom CSS files without Tailwind CSS.

## ADR 002: State Separation between Zustand and TanStack Query
- **Status**: Accepted
- **Decision**: Use **Zustand** exclusively for client UI session state (Auth, Sidebar, Theme, Notifications, User, Currency), and **TanStack Query** for all server data.

## ADR 003: Pure Business Services Layer Decoupled from React
- **Status**: Accepted
- **Decision**: Place all core business domain logic in `src/services/` as pure, side-effect-free JavaScript functions.

## ADR 004: Strict Path Alias Usage
- **Status**: Accepted
- **Decision**: Enforce path aliases (`@/components`, `@/features`, `@/services`, `@/shared`, etc.) configured in `vite.config.js`.

## ADR 005: Backend-Ready Abstracted JWT Auth Layer & Centralized Mock Data
- **Status**: Accepted
- **Decision**: Abstract all auth API calls into `src/features/auth/api/authApi.js` and move all mock datasets to `auth.mock.js` and `dashboard.mock.js`.

## ADR 006: 100% Uzbek UI Language Standard with English Code Identifiers
- **Status**: Accepted
- **Decision**: Keep variable names, React components, and file paths in English while translating all user-facing labels, buttons, messages, charts, and alerts into Uzbek.

## ADR 007: Centralized Enterprise Settings Architecture & `@dnd-kit` Drag & Drop Production Stages
- **Status**: Accepted
- **Decision**: Implement a dedicated `features/settings` module with 14 sub-pages, using `@dnd-kit` for interactive drag-and-drop production stage reordering and an extensible Permission Matrix for RBAC access controls.

## ADR 008: Dynamic Positions & HR Foundation Model
- **Status**: Accepted
- **Decision**: Store positions as dynamic entities managed via `/employees/positions` rather than static hardcoded enums.

## ADR 009: Dynamic Configuration Registry Pattern for Zero Hardcoded Business Values
- **Status**: Accepted
- **Decision**: Introduce `dynamicSettingsService` as a system-wide configuration provider for all business select options.

## ADR 010: Suppliers and Products Foundation Architecture with Dynamic Material Types
- **Status**: Accepted
- **Decision**: Store Products, Raw Materials, and Suppliers in decoupled domain features (`features/products` and `features/suppliers`), linking them dynamically via `dynamicSettingsService`.

## ADR 011: React Icons Library Standard (`react-icons/lu` & `react-icons/fa`)
- **Status**: Accepted
- **Context**: Modern vector icon support and consistent visual iconography.
- **Decision**: Deprecate Bootstrap icon font classes and adopt **React Icons** (`react-icons/lu` Lucide & `react-icons/fa` Font Awesome) across all ERP components.

## ADR 012: Dynamic Warehouse Movement & Audit Engine
- **Status**: Accepted
- **Context**: Warehouse stock receipts, production issues, sales dispatches, revaluations, and physical inventory counts require strict audit logging without hardcoded operation types or reasons.
- **Decision**: All movement types, movement reasons, revaluation reasons, and inventory count reasons are sourced dynamically from `dynamicSettingsService`.
