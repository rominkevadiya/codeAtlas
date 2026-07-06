# CodeAtlas 🗺️

> **AI-Powered Repository Visualization & Code Analysis Platform**

CodeAtlas is a full-stack platform that parses source code repositories, builds rich structural knowledge graphs, and presents interactive, AI-assisted visualizations. It allows developers to **explore codebases visually**, understand architecture at a glance, and query their code using natural language.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
  - [Modular Monolith Design](#modular-monolith-design)
  - [High-Level System Diagram](#high-level-system-diagram)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Infrastructure](#infrastructure)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Database Setup](#4-database-setup)
  - [5. Environment Variables](#5-environment-variables)
- [Running the Development Environment](#running-the-development-environment)
  - [Start the Django Backend](#start-the-django-backend)
  - [Start Celery Worker](#start-celery-worker)
  - [Start the React Frontend](#start-the-react-frontend)
- [Configuration Reference](#configuration-reference)
  - [Backend Environment Variables](#backend-environment-variables)
  - [Django Settings Overview](#django-settings-overview)
  - [Tailwind CSS v4 Configuration](#tailwind-css-v4-configuration)
  - [TypeScript Path Aliases](#typescript-path-aliases)
- [Development Workflow](#development-workflow)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Overview

CodeAtlas solves a fundamental challenge in modern software development: **understanding large codebases is hard**. When onboarding, debugging, or refactoring, developers spend enormous amounts of time reading through files to understand how things connect.

CodeAtlas automates this by:

1. **Parsing** a repository with Tree-sitter to extract functions, classes, imports, and call graphs.
2. **Building** a structural knowledge graph with NetworkX.
3. **Visualizing** that graph interactively using React Flow so you can pan, zoom, and click into any node.
4. **Augmenting** the graph with AI (Gemini API) to answer natural language questions like *"Where does authentication happen?"* or *"What calls the `send_email` function?"*

---

## Architecture

### Modular Monolith Design

CodeAtlas follows a **Modular Monolith** architecture. This is a deliberate choice over microservices because:

| Reason | Detail |
|---|---|
| **Simplicity** | One repo, one deployment unit — no distributed systems complexity at this stage. |
| **Cohesion** | The parsing, graph building, and AI layers are tightly coupled in logic. Splitting them adds friction without benefit. |
| **Scalability path** | Well-bounded modules can be extracted into services later if needed, without a rewrite. |
| **Developer velocity** | No inter-service network calls or contract negotiation in the early phases. |

The monolith is divided into two top-level directories that are independently deployable but share a common Git repository:

- **`/backend`** — Django application (API, WebSockets, task queue, business logic)
- **`/frontend`** — React application (interactive UI, graph visualization)

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CodeAtlas Monolith                         │
│                                                                     │
│   ┌──────────────────────┐         ┌────────────────────────────┐   │
│   │   React Frontend     │         │     Django Backend         │   │
│   │                      │  HTTP   │                            │   │
│   │  • React Flow Graph  │◄───────►│  • Django REST Framework   │   │
│   │  • Zustand State     │         │  • Django Channels (WS)    │   │
│   │  • Framer Motion     │  WS     │  • Celery Task Queue       │   │
│   │  • Tailwind CSS v4   │◄───────►│  • Tree-sitter Parser      │   │
│   │  • shadcn/ui         │         │  • NetworkX Graph Engine   │   │
│   │  • TypeScript        │         │  • Gemini AI (abstracted)  │   │
│   └──────────────────────┘         └────────────┬───────────────┘   │
│                                                 │                   │
│         ┌───────────────────────────────────────┼──────────┐        │
│         │                                       │          │        │
│   ┌─────▼──────┐    ┌──────────────────┐  ┌────▼──────┐   │        │
│   │ PostgreSQL │    │      Redis       │  │  Daphne   │   │        │
│   │            │    │ (Broker + Cache  │  │  (ASGI)   │   │        │
│   │ Persistent │    │  + Channel Layer)│  │           │   │        │
│   │    Data    │    │                  │  │           │   │        │
│   └────────────┘    └──────────────────┘  └───────────┘   │        │
│                                                            │        │
└────────────────────────────────────────────────────────────┘        │
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | Core UI library |
| **TypeScript** | 6.x | Type safety |
| **Vite** | 8.x | Build tool and dev server |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **shadcn/ui** | Latest | Accessible, composable component library |
| **React Flow (`@xyflow/react`)** | 12.x | Interactive graph and node visualization |
| **Framer Motion** | 12.x | Animations and transitions |
| **Zustand** | 5.x | Lightweight global state management |
| **Axios** | 1.x | HTTP client for REST API calls |
| **lucide-react** | 1.x | Icon library (shadcn/ui dependency) |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Python** | 3.13+ | Runtime |
| **Django** | 6.x | Web framework |
| **Django REST Framework** | 3.x | REST API layer |
| **Django Channels** | 4.x | WebSocket support (real-time updates) |
| **Daphne** | 4.x | ASGI server for HTTP + WebSocket |
| **Celery** | 5.x | Distributed async task queue |
| **psycopg** | 3.x | PostgreSQL driver (binary) |
| **channels-redis** | 4.x | Redis-backed channel layer |
| **python-dotenv** | 1.x | `.env` file loading |
| **django-cors-headers** | 4.x | CORS handling for the frontend |
| **Tree-sitter** | *(Phase 2)* | Source code parser |
| **NetworkX** | *(Phase 2)* | Code knowledge graph construction |

### Infrastructure

| Technology | Purpose |
|---|---|
| **PostgreSQL** | Primary relational database for all persistent data |
| **Redis** | Celery message broker, Celery result backend, Django Channels layer |
| **Git** | Version control |

---

## Project Structure

```
codeAtlas/                          ← Monolith root / Git repository
│
├── .gitignore                      ← Root gitignore (covers both frontend & backend)
├── README.md                       ← This file
│
├── frontend/                       ← React application (Vite + TypeScript)
│   ├── public/                     ← Static assets served as-is
│   ├── src/
│   │   ├── assets/                 ← Images, fonts, etc.
│   │   ├── components/             ← (Phase 2) Reusable UI components
│   │   │   └── ui/                 ← shadcn/ui generated components
│   │   ├── features/               ← (Phase 2) Feature-scoped modules
│   │   │   ├── graph/              ← React Flow graph visualization
│   │   │   ├── analysis/           ← AI analysis panels
│   │   │   └── repository/         ← Repository management
│   │   ├── hooks/                  ← (Phase 2) Custom React hooks
│   │   ├── lib/                    ← Utilities and helpers (e.g. cn() from shadcn)
│   │   ├── services/               ← (Phase 2) Axios API service layer
│   │   ├── store/                  ← (Phase 2) Zustand global state stores
│   │   ├── types/                  ← (Phase 2) Shared TypeScript types/interfaces
│   │   ├── App.tsx                 ← Root application component
│   │   ├── main.tsx                ← Entry point
│   │   └── index.css               ← Global styles + Tailwind CSS v4 directives
│   ├── index.html                  ← HTML entry point
│   ├── vite.config.ts              ← Vite + Tailwind plugin + path aliases
│   ├── tsconfig.json               ← Base TypeScript config
│   ├── tsconfig.app.json           ← App-specific TS config (with @/* path alias)
│   ├── tsconfig.node.json          ← Node/Vite TS config
│   └── package.json
│
└── backend/                        ← Django application
    ├── venv/                       ← Python virtual environment (git-ignored)
    ├── .env                        ← Environment variables (git-ignored)
    ├── manage.py                   ← Django management CLI
    │
    └── core/                       ← Django project configuration package
        ├── __init__.py
        ├── settings.py             ← All Django settings (DB, Redis, Celery, etc.)
        ├── urls.py                 ← Root URL router
        ├── asgi.py                 ← ASGI entrypoint (Channels/Daphne)
        └── wsgi.py                 ← WSGI entrypoint (standard HTTP)
```

> **Note:** Directories marked `(Phase 2)` will be created in the next phase. They are shown here to illustrate the intended scalable structure.

---

## Prerequisites

Before setting up the project, ensure the following are installed on your system.

| Software | Minimum Version | Check Command |
|---|---|---|
| **Python** | 3.13+ | `python3 --version` |
| **Node.js** | 20 LTS+ | `node -v` |
| **npm** | 10+ | `npm -v` |
| **PostgreSQL** | 14+ | `psql --version` |
| **Redis** | 6+ | `redis-server --version` |
| **Git** | 2+ | `git --version` |

### Installing Redis (Linux / WSL)

Redis is **not** typically pre-installed. Install it with:

```bash
sudo apt update
sudo apt install redis-server -y

# Start Redis and enable it on boot
sudo systemctl start redis
sudo systemctl enable redis

# Verify it's running
redis-cli ping   # Should return: PONG
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url> codeAtlas
cd codeAtlas
```

---

### 2. Backend Setup

All backend commands run from the **`codeAtlas/`** root directory unless noted.

#### Step 2a — Create the Python Virtual Environment

A virtual environment isolates the project's Python packages from your global Python installation.

```bash
# Creates the venv inside the backend/ folder
python3 -m venv backend/venv
```

#### Step 2b — Activate the Virtual Environment

```bash
# Linux / macOS / WSL
source backend/venv/bin/activate

# Windows (PowerShell)
.\backend\venv\Scripts\Activate.ps1
```

Your shell prompt should now show `(venv)` to confirm activation.

#### Step 2c — Install Python Dependencies

```bash
pip install django djangorestframework django-cors-headers \
            channels daphne channels-redis \
            celery psycopg[binary] redis \
            python-dotenv
```

| Package | Why |
|---|---|
| `django` | Core web framework |
| `djangorestframework` | REST API serializers, viewsets, routers |
| `django-cors-headers` | Allows the Vite dev server (`localhost:5173`) to call the Django API |
| `channels` | Adds WebSocket protocol support to Django |
| `daphne` | ASGI server that serves both HTTP and WebSocket connections |
| `channels-redis` | Connects Django Channels to Redis as its message bus |
| `celery` | Async/background task queue (used for repo parsing jobs) |
| `psycopg[binary]` | PostgreSQL adapter for Python (binary build = no OS-level build tools needed) |
| `redis` | Python Redis client (used by Celery) |
| `python-dotenv` | Loads `backend/.env` into `os.environ` automatically |

---

### 3. Frontend Setup

#### Step 3a — Install Node Dependencies

```bash
cd frontend
npm install
```

This installs all packages defined in `package.json`, including:

```bash
# Runtime dependencies
@xyflow/react      # Interactive node-graph canvas
framer-motion      # Animation library
zustand            # State management
axios              # HTTP client
clsx               # Conditional class names
tailwind-merge     # Merges conflicting Tailwind classes
lucide-react       # Icon library

# Dev dependencies
tailwindcss        # CSS framework (v4)
@tailwindcss/vite  # Vite plugin for Tailwind v4 (replaces postcss config)
typescript         # Type checking
vite               # Build tool
```

---

### 4. Database Setup

#### Step 4a — Create the PostgreSQL Database

```bash
# Connect as the postgres superuser
sudo -u postgres psql

# Inside the psql shell:
CREATE DATABASE codeatlas;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE codeatlas TO postgres;
\q
```

> **Tip:** You can change the database name, user, and password — just make sure to update your `backend/.env` file accordingly.

#### Step 4b — Run Migrations

> **Phase 1 Note:** No custom models exist yet, but this applies Django's built-in migrations (users, sessions, admin, etc.).

```bash
# From the codeAtlas/ root, with venv active
python backend/manage.py migrate
```

---

### 5. Environment Variables

The backend reads all secrets and configuration from `backend/.env`. This file is **git-ignored** and must be created manually on each machine.

A `.env` file has been pre-created at `backend/.env` with development defaults:

```env
# backend/.env

# Django Core
SECRET_KEY=django-insecure-replace-me-in-production
DEBUG=True
ALLOWED_HOSTS=*

# PostgreSQL — update these to match your local setup
DB_NAME=codeatlas
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://127.0.0.1:6379/0
```

> ⚠️ **Never commit `.env` to Git.** It is already listed in `.gitignore`. For production deployments, inject secrets via environment variables or a secrets manager.

---

## Running the Development Environment

You need **three terminal windows** open simultaneously during development.

### Start the Django Backend

```bash
# Terminal 1 — from codeAtlas/ root with venv active
source backend/venv/bin/activate
python backend/manage.py runserver
```

The Django development server starts at: **http://127.0.0.1:8000**

The `runserver` command uses Daphne under the hood (because `ASGI_APPLICATION` is configured), which means it handles both standard HTTP requests and WebSocket connections.

---

### Start Celery Worker

Celery handles long-running background tasks (e.g., parsing a repository). It must run separately from Django.

```bash
# Terminal 2 — from the backend/ directory with venv active
source backend/venv/bin/activate
cd backend
celery -A core worker --loglevel=info
```

| Flag | Meaning |
|---|---|
| `-A core` | Tells Celery to find the app in the `core` Django project |
| `worker` | Starts a worker process that consumes tasks from the Redis queue |
| `--loglevel=info` | Shows task execution logs in the terminal |

---

### Start the React Frontend

```bash
# Terminal 3 — from the frontend/ directory
cd frontend
npm run dev
```

The Vite dev server starts at: **http://localhost:5173**

Vite provides:
- **Hot Module Replacement (HMR):** UI updates instantly without a full page reload.
- **Fast cold starts:** Sub-second server startup due to native ES modules.

---

## Configuration Reference

### Backend Environment Variables

| Variable | Default | Description |
|---|---|---|
| `SECRET_KEY` | insecure dev key | Django's cryptographic signing key. **Must be changed in production.** |
| `DEBUG` | `True` | Enables Django debug mode. Set to `False` in production. |
| `ALLOWED_HOSTS` | `*` | Comma-separated list of allowed hostnames. Use `*` for dev only. |
| `DB_NAME` | `codeatlas` | PostgreSQL database name |
| `DB_USER` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `REDIS_URL` | `redis://127.0.0.1:6379/0` | Redis connection URL. Used for Celery broker, result backend, and Channels layer. |

---

### Django Settings Overview

`backend/core/settings.py` is the single source of truth for all Django configuration.

**Key sections:**

```python
INSTALLED_APPS = [
    'daphne',             # Must be FIRST — overrides runserver to use ASGI
    ...
    'rest_framework',     # Adds DRF serializers, viewsets, etc.
    'corsheaders',        # Adds CORS middleware support
    'channels',           # Adds WebSocket protocol layer
]

MIDDLEWARE = [
    ...
    'corsheaders.middleware.CorsMiddleware',  # Must be before CommonMiddleware
    ...
]

# Tells Django to use Daphne/Channels for WebSocket routing
ASGI_APPLICATION = 'core.asgi.application'

# Allows the React frontend (on port 5173) to make API calls
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Redis powers both the real-time WebSocket channel layer
# and the Celery async task queue
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {"hosts": [REDIS_URL]},
    }
}
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
```

---

### Tailwind CSS v4 Configuration

This project uses **Tailwind CSS v4**, which has a fundamentally different setup from v3.

**Key differences from v3:**

| Aspect | v3 | v4 (this project) |
|---|---|---|
| Config file | `tailwind.config.js` required | No config file needed by default |
| PostCSS | Configured via `postcss.config.js` | Handled by the `@tailwindcss/vite` plugin |
| Import | `@tailwind base/components/utilities` | Single `@import "tailwindcss"` |
| Theming | `theme.extend` in JS config | `@theme {}` block in CSS |

**`vite.config.ts`** — The Tailwind plugin is registered here:
```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),  // Processes CSS before Vite bundles it
    react()
  ],
})
```

**`src/index.css`** — Tailwind is imported and CSS design tokens are defined here using `@theme` and `@layer`:
```css
@import "tailwindcss";

@theme {
  /* Maps Tailwind color utilities to CSS custom properties */
  --color-primary: hsl(var(--primary));
  /* ...etc */
}

@layer base {
  :root {
    /* Light mode CSS variables */
    --primary: 222.2 47.4% 11.2%;
  }
  .dark {
    /* Dark mode CSS variables */
    --primary: 210 40% 98%;
  }
}
```

> **Note:** Your IDE may show an `Unknown at rule @theme` warning. This is expected — the `@theme` rule is a Tailwind v4 extension that standard CSS language servers don't recognize. It is **not** an error and will compile correctly.

---

### TypeScript Path Aliases

The `@/*` alias maps to `src/*`, enabling clean absolute imports instead of relative path chains (`../../../`).

**`tsconfig.app.json`:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**`vite.config.ts`:**
```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
```

**Usage in code:**
```typescript
// ❌ Relative (fragile, breaks on refactoring)
import { Button } from '../../../components/ui/button'

// ✅ Absolute (clean, location-independent)
import { Button } from '@/components/ui/button'
```

---

## Development Workflow

```
1. Make a code change in frontend/src/ or backend/
2. Frontend:  Vite HMR instantly reflects changes in the browser.
3. Backend:   Django's runserver auto-reloads Python files on save.
4. Database:  python backend/manage.py makemigrations && migrate (after model changes).
5. Celery:    Restart the Celery worker after changing task definitions.
6. Commit:    git add . && git commit -m "feat: your feature description"
```

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| **Phase 1** | ✅ Complete | Project environment setup — folder structure, Django, React, PostgreSQL, Redis, Tailwind, TypeScript, Git |
| **Phase 2** | 🔜 Next | Django application modules, REST API endpoints, React routing and page scaffold |
| **Phase 3** | 📋 Planned | Tree-sitter code parser, NetworkX graph builder, repository upload pipeline |
| **Phase 4** | 📋 Planned | React Flow interactive graph visualization, shadcn/ui component library |
| **Phase 5** | 📋 Planned | Gemini AI integration (provider-abstracted), natural language code queries |
| **Phase 6** | 📋 Planned | Real-time progress updates via WebSockets (Celery → Channels → React) |
| **Phase 7** | 📋 Planned | Authentication, user accounts, saved repository sessions |
| **Phase 8** | 📋 Planned | Production deployment, Docker, CI/CD |

---

## Contributing

This project is currently in early development. The branching strategy is:

```
main          ← Stable, production-ready code only
dev           ← Active development branch
feature/*     ← Feature branches (e.g. feature/graph-renderer)
fix/*         ← Bug fix branches
```

**Commit message convention (Conventional Commits):**
```
feat:     A new feature
fix:      A bug fix
docs:     Documentation changes only
style:    Formatting, no logic change
refactor: Code restructuring, no behavior change
test:     Adding or updating tests
chore:    Build process or tooling changes
```

---

*Built with ❤️ using Django, React, and an obsession with clean architecture.*
