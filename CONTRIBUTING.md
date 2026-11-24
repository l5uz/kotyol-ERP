# Contributing to Kotyol Enterprise ERP

Thank you for your interest in contributing to **Kotyol Enterprise ERP**! Contributions of all kinds—bug fixes, new ERP modules, localization improvements, documentation updates, and tests—are welcome.

## Development Setup

### Prerequisites
- **Node.js** `>= 18` (Node 20 recommended) and **npm** `>= 9`
- **Python** `>= 3.10` (Python 3.11+ recommended)

### 1. Fork & Clone
```bash
git clone https://github.com/l5uz/kotyol-ERP.git
cd kotyol-ERP
```

### 2. Frontend Setup
```bash
cp .env.example .env
npm install
npm run dev
```

### 3. Backend Setup (Django + DRF)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
cp .env.example .env
pip install -r requirements.txt
python manage.py migrate
python manage.py init_db
python manage.py runserver 8000
```

## Coding Standards

Please read [`docs/coding_standards.md`](docs/coding_standards.md) and [`docs/architecture.md`](docs/architecture.md) before making substantial changes:
- Keep all code, identifiers, file paths, and comments in **English**.
- Keep user-facing UI strings consistent with the active localization.
- Follow the modular feature structure under `src/features/` and `backend/apps/`.

### Before Opening a Pull Request
Run linting, formatting, and build checks locally:
```bash
npm run lint
npm run format
npm run build
```
For backend changes, verify Django checks and migrations:
```bash
cd backend
python manage.py check
```

## Commit & Pull Request Guidelines

- Use clear, descriptive commit messages following Conventional Commits (e.g., `feat(sales): add receipt footer settings`, `fix(warehouse): prevent negative stock`).
- Keep pull requests focused on a single feature or bug fix.
- Include screenshots or reproduction steps for UI or workflow changes.
- Reference related issues in the PR description.
