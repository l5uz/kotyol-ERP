# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in **Kotyol Enterprise ERP**, please report it responsibly rather than opening a public GitHub issue.

- **Preferred:** Use GitHub's **Private Vulnerability Reporting** (Security tab -> *Report a vulnerability*) on this repository.
- Include a clear description of the issue, steps to reproduce, and potential impact.

We will acknowledge receipt and work on a fix as quickly as possible.

## Production Deployment Checklist

When deploying Kotyol ERP to production, always configure the following via environment variables (`.env`) and **never** use default development values:

- Set a strong, randomly generated `SECRET_KEY` (at least 32+ bytes).
- Set `ENVIRONMENT=production` so Django `DEBUG` mode is disabled.
- Change `SUPERADMIN_USERNAME` and `SUPERADMIN_PASSWORD` before running `init_db`.
- Restrict `ALLOWED_HOSTS` and CORS origins to your trusted frontend domain(s).
- Use HTTPS/TLS in front of both the frontend and backend API.
- Rotate JWT signing keys if a secret is ever exposed.
