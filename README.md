# PSI Dashboard Frontend

Frontend Nuxt del PSI Dashboard.

## Documentación

La documentación completa se encuentra disponible en la carpeta [`docs/`](./docs/README.md):

- **[Arquitectura (`docs/architecture.md`)](./docs/architecture.md)**.
- **[Composables y Estado (`docs/composables-and-state.md`)](./docs/composables-and-state.md)**.
- **[Componentes y UI (`docs/components-and-ui.md`)](./docs/components-and-ui.md)**.
- **[APIs y Backend (`docs/api-and-backend.md`)](./docs/api-and-backend.md)**.

## Requisitos Previos

Contá con las siguientes herramientas instaladas en tu sistema:
- **Node.js**: v18.x o v20.x +
- **pnpm**: v9.x o superior.

## Setup

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/psiware-development/psidashboard-frontend
   cd psidashboard-frontend
   ```

2. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

3. **Configurar las variables de entorno**:
   Copiá el archivo de ejemplo `.env.example` para crear tu `.env` y luego configurá las variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. **Correr el proyecto**:
   ```bash
   pnpm run dev
   ```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `API_BASE_URL` | URL del backend real (proxy vía `/backend/**`) |

Ejemplo:

```env
API_BASE_URL=https://psi-rest-services.onrender.com
```

## Estructura de Carpetas

```bash
app/
├── assets/          # Archivos estáticos y recursos globales
├── components/      # Componentes organizados por dominio
│   ├── collaborators/
│   ├── home/
│   ├── project/
│   └── user/
├── composables/     # Lógica reutilizable y gestión de datos
├── layouts/         # Layouts de la aplicación
├── middleware/      # Middlewares de ruteo
├── pages/           # Páginas de la aplicación
├── plugins/         # Plugins
├── stores/          # Stores
├── types/           # Definiciones e interfaces
└── utils/           # Utilidades
```