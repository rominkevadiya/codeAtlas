# CodeAtlas 🗺️

> **AI-Powered Repository Visualization & Code Analysis Platform**

CodeAtlas is a full-stack platform that parses source code repositories, builds rich structural knowledge graphs, and presents interactive, AI-assisted visualizations. It allows developers to **explore codebases visually**, understand architecture at a glance, and query their code using natural language.

---

## Table of Contents

- [Overview](#overview)
- [Current Status](#current-status)
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
  - [Start the React Frontend](#start-the-react-frontend)
- [API Reference](#api-reference)
- [Configuration Reference](#configuration-reference)
  - [Backend Environment Variables](#backend-environment-variables)
  - [TypeScript Path Aliases](#typescript-path-aliases)
- [Development Workflow](#development-workflow)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Overview

CodeAtlas solves a fundamental challenge in modern software development: **understanding large codebases is hard**. When onboarding, debugging, or refactoring, developers spend enormous amounts of time reading through files to understand how things connect.

CodeAtlas automates this by:

1. **Parsing** a repository (uploaded as a ZIP) with Tree-sitter to extract functions, classes, imports, and containment relationships.
2. **Building** a structural knowledge graph with NetworkX, persisted as `knowledge_graph.json`.
3. **Visualizing** that graph interactively using React Flow — pan, zoom, click into any node — with auto-layout powered by Dagre.
4. **Augmenting** the graph with AI (Gemini API) to answer natural language questions like *"Where does authentication happen?"* or *"What calls the `send_email` function?"*

---

## Current Status

| Phase | Status | Description |
|---|---|---|
| **Phase 1** | ✅ **Complete** | Project setup — folder structure, Django, React, PostgreSQL, Tailwind, TypeScript, Git |
| **Phase 2** | ✅ **Complete** | Django domain modules, REST API endpoints, React routing and page scaffold |
| **Phase 3** | ✅ **Complete** | Tree-sitter parser, NetworkX graph builder, ZIP upload pipeline, `knowledge_graph.json` persistence |
| **Phase 4** | ✅ **Complete** | `GET /graph/` API, React Flow interactive visualization, Dagre auto-layout, custom node components |
| **Phase 5** | ✅ **Complete** | Gemini AI integration — natural language code queries |
| **Phase 6** | 🔜 **Next** | Real-time WebSocket progress updates (Celery → Channels → React) |
| **Phase 7** | 📋 Planned | Authentication, user accounts, saved repository sessions |
| **Phase 8** | 📋 Planned | Production deployment, Docker, CI/CD |

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

- **`/backend`** — Django application (API, business logic, parser, graph engine)
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
│   │  • Dagre Auto-layout │         │  • RepositoryViewSet       │   │
│   │  • Custom EntityNode │  REST   │  • RepoService (upload)    │   │
│   │  • Zustand State     │◄───────►│  • ParserService (AST)     │   │
│   │  • Tailwind CSS v4   │         │  • GraphService (NetworkX) │   │
│   │  • TypeScript        │         │  • Gemini AI (Phase 5)     │   │
│   └──────────────────────┘         └────────────┬───────────────┘   │
│                                                 │                   │
│                          ┌──────────────────────┤                   │
│                          │                      │                   │
│                   ┌──────▼──────┐    ┌──────────▼──────────┐        │
│                   │ PostgreSQL  │    │  Local Filesystem    │        │
│                   │             │    │  (media/repositories)│        │
│                   │  Repo meta  │    │  ├─ extracted ZIP    │        │
│                   │  (UUID, name│    │  └─ knowledge_graph  │        │
│                   │   path)     │    │       .json          │        │
│                   └─────────────┘    └──────────────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | Core UI library |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 6.x | Build tool and dev server |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **React Flow (`@xyflow/react`)** | 12.x | Interactive graph and node visualization |
| **Dagre** | 0.8.x | Automatic graph layout algorithm (Left-to-Right) |
| **Zustand** | 5.x | Lightweight global state management |
| **Axios** | 1.x | HTTP client for REST API calls |
| **lucide-react** | Latest | Icon library |
| **React Router DOM** | 7.x | Client-side routing |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Python** | 3.13+ | Runtime |
| **Django** | 5.x | Web framework |
| **Django REST Framework** | 3.x | REST API layer (ViewSets, Routers, Serializers) |
| **Django Channels** | 4.x | WebSocket support (Phase 6) |
| **Daphne** | 4.x | ASGI server for HTTP + WebSocket |
| **psycopg** | 3.x | PostgreSQL driver (binary) |
| **python-dotenv** | 1.x | `.env` file loading |
| **django-cors-headers** | 4.x | CORS handling for the frontend |
| **Tree-sitter** | 0.26+ | Source code AST parser (Python support) |
| **tree-sitter-python** | Latest | Python language grammar for Tree-sitter |
| **NetworkX** | 3.x | Code knowledge graph construction and serialization |

### Infrastructure

| Technology | Purpose |
|---|---|
| **PostgreSQL** | Primary relational database — stores repository metadata (UUID, name, local_path) |
| **Local Filesystem** | Stores extracted ZIP content and `knowledge_graph.json` under `backend/config/media/repositories/<uuid>/` |
| **Redis** | *(Phase 6)* Celery message broker, Django Channels layer |

---

## Project Structure

```
codeAtlas/                            ← Monolith root / Git repository
│
├── .gitignore
├── README.md                         ← This file
├── ARCHITECTURE.md                   ← Domain module architecture & DDD standards
│
├── frontend/                         ← React application (Vite + TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/               ← MainLayout (navbar, sidebar, outlet)
│   │   │   └── ui/                   ← shadcn/ui generated components
│   │   ├── features/
│   │   │   ├── graph/                ← React Flow graph canvas
│   │   │   │   ├── CodeGraph.tsx     ← Main canvas: data → dagre layout → ReactFlow
│   │   │   │   └── nodes/
│   │   │   │       └── EntityNode.tsx ← Custom node: file/class/function with icon
│start    │   │   └── repository/           ← (Placeholder for future repo features)
│   │   ├── pages/
│   │   │   ├── Home.tsx              ← Repository list + ZIP upload form
│   │   │   └── RepositoryDashboard.tsx ← Fetches graph, renders CodeGraph
│   │   ├── services/
│   │   │   └── api.ts                ← Axios instance + RepositoryService
│   │   ├── store/                    ← Zustand stores (Phase 5+)
│   │   ├── types/                    ← Shared TypeScript interfaces
│   │   ├── App.tsx                   ← Router: / → Home, /repository/:id → Dashboard
│   │   ├── main.tsx
│   │   └── index.css                 ← Global styles + Tailwind v4 directives
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.app.json
│   └── package.json
│
└── backend/                          ← Django application
    ├── venv/                         ← Python virtual environment (git-ignored)
    ├── .env                          ← Secrets & config (git-ignored)
    ├── manage.py
    │
    └── apps/                         ← Domain modules (bounded contexts)
        ├── accounts/                 ← (Placeholder) User & Auth Domain
        ├── repositories/             ← ✅ Active: Upload, extract, list repos
        │   ├── models.py             ←   Repository(id, name, url, local_path, ...)
        │   ├── services.py           ←   RepoService: upload_and_extract_repository()
        │   ├── serializers.py
        │   ├── views.py              ←   RepositoryViewSet: upload, graph, CRUD
        │   └── urls.py
        ├── parser/                   ← ✅ Active: Tree-sitter AST extraction
        │   └── services.py           ←   ParserService.parse_repository(path)
        ├── graph/                    ← ✅ Active: NetworkX graph builder
        │   └── services.py           ←   GraphService.build_graph(parsed_data)
        ├── analysis/                 ← (Placeholder) Code metrics
        ├── ai/                       ← ✅ Active: Gemini AI queries (Phase 5)
        ├── websocket/                ← (Placeholder) Real-time events (Phase 6)
        └── common/                   ← Shared base classes & exceptions
    │
    └── config/                       ← Django project settings
        ├── settings.py
        ├── urls.py                   ←   Root router → /api/v1/repositories/
        ├── asgi.py
        └── media/
            └── repositories/
                └── <uuid>/           ← Extracted repo + knowledge_graph.json
```

---

## Prerequisites

| Software | Minimum Version | Check Command |
|---|---|---|
| **Python** | 3.13+ | `python3 --version` |
| **Node.js** | 20 LTS+ | `node -v` |
| **npm** | 10+ | `npm -v` |
| **PostgreSQL** | 14+ | `psql --version` |
| **Git** | 2+ | `git --version` |

> **Note:** Redis is no longer required for the current Phase 1-4 implementation. It will be needed in Phase 6 (WebSockets/Celery).

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url> codeAtlas
cd codeAtlas
```

---

### 2. Backend Setup

#### Step 2a — Create & Activate the Python Virtual Environment

```bash
# Create the venv inside the backend/ folder
python3 -m venv backend/venv

# Activate (Linux / macOS / WSL)
source backend/venv/bin/activate
```

Your shell prompt should now show `(venv)`.

#### Step 2b — Install Python Dependencies

```bash
pip install django djangorestframework django-cors-headers \
            channels daphne \
            psycopg[binary] \
            python-dotenv \
            tree-sitter tree-sitter-python \
            networkx
```

| Package | Why |
|---|---|
| `django` | Core web framework |
| `djangorestframework` | REST API serializers, viewsets, routers |
| `django-cors-headers` | Allows the Vite dev server (`localhost:5173`) to call the Django API |
| `channels` + `daphne` | ASGI server for HTTP (+ WebSocket in Phase 6) |
| `psycopg[binary]` | PostgreSQL adapter for Python |
| `python-dotenv` | Loads `backend/.env` into `os.environ` |
| `tree-sitter` + `tree-sitter-python` | AST parsing of Python source files |
| `networkx` | Knowledge graph construction and JSON serialization |

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Key dependencies installed:

```
@xyflow/react        # Interactive graph canvas
dagre / @types/dagre # Auto-layout engine for the graph
zustand              # State management
axios                # HTTP client
lucide-react         # Icon library
react-router-dom     # Client-side routing
```

---

### 4. Database Setup

```bash
# Connect as the postgres superuser
sudo -u postgres psql

# Inside psql:
CREATE DATABASE codeatlas;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE codeatlas TO postgres;
\q

# Run Django migrations (with venv active, from codeAtlas/ root)
python backend/manage.py migrate
```

---

### 5. Environment Variables

Create `backend/.env` (git-ignored). A template:

```env
# backend/.env

# Django Core
SECRET_KEY=django-insecure-replace-me-in-production
DEBUG=True
ALLOWED_HOSTS=*

# PostgreSQL
DB_NAME=codeatlas
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Redis (not used until Phase 6)
REDIS_URL=redis://127.0.0.1:6379/0

# Gemini AI (Phase 5)
# GEMINI_API_KEY=your-api-key-here
```

> ⚠️ **Never commit `.env` to Git.** It is already listed in `.gitignore`.

---

## Running the Development Environment

You need **two terminal windows** for the current phase.

### Start the Django Backend

```bash
# Terminal 1 — from codeAtlas/ root with venv active
source backend/venv/bin/activate
python backend/manage.py runserver
```

Django dev server: **http://127.0.0.1:8000**

### Start the React Frontend

```bash
# Terminal 2 — from the frontend/ directory
cd frontend
npm run dev
```

Vite dev server: **http://localhost:5173**

---

## API Reference

All endpoints are prefixed with `/api/v1/`.

### Repositories

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/repositories/` | List all uploaded repositories |
| `POST` | `/repositories/upload/` | Upload a ZIP file → extract → parse AST → build graph |
| `GET` | `/repositories/<id>/` | Retrieve single repository metadata |
| `DELETE` | `/repositories/<id>/` | Delete a repository record |
| `GET` | `/repositories/<id>/graph/` | **Serve the `knowledge_graph.json`** for visualization |

#### `POST /repositories/upload/`

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | ✅ | Display name for the repository |
| `file` | `File (.zip)` | ✅ | ZIP archive of the repository |

**Response `201 Created`:**
```json
{
  "id": "45c4652d-ed72-492f-bf06-a47c563561b4",
  "name": "myproject",
  "url": "local://uploaded",
  "is_cloned": true,
  "local_path": "/path/to/media/repositories/<uuid>",
  "created_at": "2026-07-11T17:15:11Z"
}
```

#### `GET /repositories/<id>/graph/`

**Response `200 OK`:** NetworkX node-link JSON
```json
{
  "directed": true,
  "multigraph": false,
  "nodes": [
    { "id": "src/main.py", "type": "file", "name": "src/main.py" },
    { "id": "src/main.py:main", "type": "function", "name": "main" }
  ],
  "edges": [
    { "source": "src/main.py", "target": "src/main.py:main", "type": "contains" },
    { "source": "src/main.py", "target": "os", "type": "imports" }
  ]
}
```

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
| `REDIS_URL` | `redis://127.0.0.1:6379/0` | Redis URL (required from Phase 6) |
| `GEMINI_API_KEY` | — | Gemini AI API key (required from Phase 5) |

### TypeScript Path Aliases

The `@/*` alias maps to `src/*`, enabling clean absolute imports.

```typescript
// ❌ Relative (fragile)
import { Button } from '../../../components/ui/button'

// ✅ Absolute (clean)
import { Button } from '@/components/ui/button'
```

---

## Development Workflow

```
1. Make a code change in frontend/src/ or backend/
2. Frontend:  Vite HMR instantly reflects changes in the browser.
3. Backend:   Django's runserver auto-reloads Python files on save.
4. Database:  python backend/manage.py makemigrations && migrate (after model changes).
5. Commit:    git add . && git commit -m "feat: your feature description"
```

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| **Phase 1** | ✅ Complete | Project environment setup — folder structure, Django, React, PostgreSQL, Tailwind, TypeScript |
| **Phase 2** | ✅ Complete | Django domain modules (`repositories`, `parser`, `graph`, `common`), REST API, React routing |
| **Phase 3** | ✅ Complete | Tree-sitter AST parser, NetworkX graph engine, ZIP upload pipeline, `knowledge_graph.json` |
| **Phase 4** | ✅ Complete | `GET /graph/` API endpoint, React Flow canvas, Dagre auto-layout, `EntityNode` custom node |
| **Phase 5** | ✅ Complete | Gemini AI integration — natural language code queries ("What calls X?") |
| **Phase 6** | 🔜 Next | Real-time WebSocket progress via Celery + Django Channels |
| **Phase 7** | 📋 Planned | Authentication, user accounts, saved sessions |
| **Phase 8** | 📋 Planned | Production deployment, Docker, CI/CD |

---

## Contributing

```
main          ← Stable, production-ready code only
dev           ← Active development branch
feature/*     ← Feature branches (e.g. feature/ai-query-panel)
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

*Built with ❤️ using Django, React, Tree-sitter, NetworkX, and React Flow.*
