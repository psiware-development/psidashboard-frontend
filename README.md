# PSI Dashboard Frontend

Frontend Nuxt del PSI Dashboard.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `API_BASE_URL` | URL del backend real (proxy vía `/backend/**`) |

Ejemplo:

```
API_BASE_URL=https://psi-rest-services.onrender.com
```
