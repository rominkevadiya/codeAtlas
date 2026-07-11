# CodeAtlas Frontend

This is the React frontend for the CodeAtlas platform — an AI-powered repository visualization tool that renders interactive knowledge graphs of Python codebases.

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Core UI library |
| **TypeScript 5** | Type safety |
| **Vite 6** | Build tool & dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **React Flow (`@xyflow/react`)** | Interactive graph canvas |
| **Dagre** | Automatic Left-to-Right graph layout |
| **Axios** | HTTP client for the Django REST API |
| **React Router DOM** | Client-side routing |
| **Zustand** | Global state management |
| **lucide-react** | Icon library |

## Project Structure

```
src/
├── App.tsx                        ← Router: / and /repository/:id
├── main.tsx                       ← Entry point
├── index.css                      ← Global styles + Tailwind v4
│
├── components/
│   ├── layout/                    ← MainLayout: navbar + <Outlet />
│   └── ui/                        ← shadcn/ui components
│
├── features/
│   └── graph/
│       ├── CodeGraph.tsx          ← Main canvas component
│       └── nodes/
│           └── EntityNode.tsx     ← Custom node: icon + name + path
│
├── pages/
│   ├── Home.tsx                   ← Repo list + ZIP upload form
│   └── RepositoryDashboard.tsx   ← Graph fetcher + renderer
│
└── services/
    └── api.ts                     ← Axios + RepositoryService
```

## Available Scripts

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

## Key API Calls

```typescript
// List all repositories
RepositoryService.getRepositories()

// Upload a ZIP file and trigger the parse + graph pipeline
RepositoryService.uploadRepository(name, file)

// Fetch the knowledge graph for visualization
RepositoryService.getGraph(id)
```

## Graph Visualization

The `CodeGraph` component takes the raw `knowledge_graph.json` data from the API and:
1. Maps nodes to custom `EntityNode` components (color-coded by type: file/class/function)
2. Maps edges (styled differently for `contains` vs `imports` relationships)
3. Runs **Dagre** auto-layout in Left-to-Right direction
4. Renders with React Flow (pan, zoom, minimap, controls)

## Environment

The API base URL is set in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

Change this to point to your Django backend if running on a different host/port.
