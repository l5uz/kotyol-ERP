# Kotyol Enterprise ERP

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=white)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django-5.1+-092E20.svg?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![CI](https://github.com/l5uz/kotyol-ERP/actions/workflows/ci.yml/badge.svg)](https://github.com/l5uz/kotyol-ERP/actions/workflows/ci.yml)
[![UI Language](https://img.shields.io/badge/UI_Language-Uzbek_100%25-orange.svg)]()

**Kotyol Enterprise ERP** is an open-source, modular, full-stack Manufacturing Resource Planning (MRP/ERP) platform built with **React + Vite** and **Django REST Framework**. Originally engineered for industrial boiler manufacturing, its domain-driven architecture covers the complete manufacturing lifecycle: Bill of Materials (BOM) recipes, procurement, warehouse inventory, order reservation, Kanban production scheduling, invoicing & 80mm thermal receipt printing, warranty service tracking, managerial finance, and immutable audit logging.

---

## Key Features & Architecture Highlights

- **Full-Stack Modular Architecture**: Clean English codebase with 22 decoupled frontend feature modules (`src/features/*`) and 11 Django backend apps (`backend/apps/*`).
- **Complete Manufacturing & ERP Lifecycle**:
  1. `auth` — JWT authentication, refresh tokens, role-based access & session management
  2. `dashboard` — Executive KPI dashboard & operational analytics
  3. `settings` — Enterprise configuration (14 sub-pages, drag-and-drop production stages, company profile)
  4. `employees` — HR, personnel management & payroll tracking
  5. `suppliers` — Supplier directory, balances & procurement history
  6. `products` — Raw materials & finished goods nomenclature
  7. `boilers` — Industrial boiler & furnace product catalog
  8. `recipes` — Bill of Materials (BOM) & multi-version recipe engine
  9. `purchasing` — Automated stock receiving & supplier procurement
  10. `warehouse` — Inventory movements, stock audits & revaluation
  11. `customers` — Customer CRM profiles, leads & contract ledger
  12. `orders` — Order reservation engine & material availability audit
  13. `production` — Production orders, stage transitions & audit trail
  14. `kanban` — Visual drag-and-drop production Kanban board with quick-inspection drawer
  15. `sales` — Invoicing, tax (QQS 12%), profit margins, automated stock dispatch & 80mm thermal receipt printing (`ESC/POS` & print popup)
  16. `services` — Warranty tracking, technician allocation & service logs
  17. `finance` — Managerial finance, expenses, revenue & profit analytics
  18. `reports` — Enterprise analytics with Recharts & Excel/PDF export
  19. `notifications` — Real-time unread notification drawer
  20. `activities` — Global event timeline
  21. `audit` — Immutable system audit log with old-vs-new value diffs
  22. `system` — Engine health, database status & document numbering previews
- **Reusable Core Engines**:
  - **Unified Filter System (`FilterBar`)**: Universal filter bar across modules with persisted preferences (`useFilterPreferencesStore`).
  - **Dynamic Entities (`DynamicSelect`)**: Inline `+ Add New` modals and direct settings navigation without interrupting form workflows.
  - **Centralized Document Numbering (`documentNumberingService`)**: Standardized document codes (`ORD-YYYY-000001`, `PRD-YYYY-000001`, `SAL-YYYY-000001`, `EXP-YYYY-000001`).
  - **Data Integrity & Soft Delete (`dataIntegrityService`)**: Protects linked master records from accidental hard deletion.
- **100% Uzbek UI, 100% English Codebase**: Production-ready Uzbek localization for Central Asian SMEs while keeping all source code, APIs, and technical documentation in clean English for global contributors.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router 6, TanStack React Query, Zustand, React Hook Form, `@dnd-kit`, Recharts, Bootstrap 5 |
| **Backend** | Python 3.11+, Django 5.1+, Django REST Framework, PyJWT, bcrypt, django-cors-headers |
| **Database** | SQLite (default local/dev), PostgreSQL-ready configuration |
| **Tooling** | ESLint, Prettier, GitHub Actions CI, Netlify deployment config |

---

## Quick Start

### Requirements
- **Node.js** `>= 18` (v20 recommended) & **npm** `>= 9`
- **Python** `>= 3.10`

### 1. Clone the Repository
```bash
git clone https://github.com/l5uz/kotyol-ERP.git
cd kotyol-ERP
```

### 2. Start the Backend (Django API)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
cp .env.example .env
pip install -r requirements.txt
python manage.py migrate
python manage.py init_db
python manage.py runserver 8000
```
The API will be available at `http://127.0.0.1:8000/api/v1`.

### 3. Start the Frontend (React + Vite)
In a separate terminal from the project root:
```bash
cp .env.example .env
npm install
npm run dev
```

### Production Build & Linting
```bash
npm run lint
npm run build
```

---

## Technical Documentation

Detailed architectural and API specifications are maintained in [`docs/`](docs/):
- [Architecture Specifications](docs/architecture.md)
- [API Endpoints Reference](docs/api_endpoints.md)
- [Backend API Integration Rules](docs/api_rules.md)
- [Business Workflow Models](docs/business_flow.md)
- [Folder Structure Map](docs/folder_structure.md)
- [Coding Standards](docs/coding_standards.md)
- [Architecture Decision Records (ADRs)](docs/decisions.md)
- [Pagination & Filters Guide](docs/pagination_and_filters.md)
- [Milestone Roadmap Tracker](docs/roadmap.md)
- [Current System State](docs/current_state.md)

---

## Contributing & Security

- Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a pull request.
- To report a security vulnerability or review production hardening recommendations, see [SECURITY.md](SECURITY.md).

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
