# Arbor Frontend

React frontend for Arbor - Project Portfolio Management System

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **TanStack Query (React Query)** - Server state management
- **React Router** - Client-side routing
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Project Structure

```
src/
├── api/
│   └── client.ts           # Axios API client with all endpoints
├── components/
│   ├── Layout.tsx          # App layout with sidebar
│   └── ui/                 # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── badge.tsx
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
├── hooks/                  # Custom React hooks (if needed)
├── lib/
│   └── utils.ts            # Utility functions (cn helper)
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── PortfoliosPage.tsx
│   ├── PortfolioDetailPage.tsx
│   ├── ProjectDetailPage.tsx
│   ├── TaskDetailPage.tsx
│   ├── TeamPage.tsx
│   └── TemplatesPage.tsx
├── types/
│   └── index.ts            # TypeScript type definitions
├── App.tsx                 # Router configuration
├── main.tsx                # Entry point
└── index.css               # Tailwind styles
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment configuration:**
   Create `.env` in the project root:
   ```
   VITE_API_URL=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## Features Implemented

### Authentication
- Login with email/password
- Tenant registration (creates organization + admin user)
- Protected routes
- Automatic token management
- Logout

### Dashboard
- My tasks summary (total, overdue, due soon, blocked)
- At-risk projects highlighting
- Portfolio list
- Project timeline visualization with progress bars
- RAG status indicators

### Portfolios
- List all portfolios (active & archived)
- Portfolio cards with project count
- Portfolio detail view
- Project listing within portfolio

### Projects
- Project detail view
- Task tree display
- Project stats (total tasks, completed, overdue, blocked)
- RAG status badges
- Navigation to task detail

### Tasks
- Task detail page
- Status display (not started, in progress, blocked, done)
- Assignment information
- Due dates
- Priority badges
- Subtask listing
- Breadcrumb navigation

### Team
- Team workload overview
- At-risk member highlighting
- Task distribution by member
- All members directory

### Templates
- Template list view
- Active/inactive indicators
- Task count display

## API Integration

The `api/client.ts` file contains a complete typed API client:

```typescript
// Example usage
import { api } from '@/api/client';

// Get dashboard data
const dashboard = await api.getDashboard();

// Login
const { user, token } = await api.login({ email, password });

// Get portfolio with projects
const portfolio = await api.getPortfolio(1);
```

## UI Components

Custom shadcn/ui-inspired components in `components/ui/`:
- **Button** - Primary, secondary, destructive, ghost, link variants
- **Card** - Header, content, footer, title, description
- **Input** - Text input with focus states
- **Badge** - Status indicators, includes RAG status variants

## Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | LoginPage | Authentication |
| `/register` | RegisterPage | Tenant signup |
| `/dashboard` | DashboardPage | Main overview |
| `/portfolios` | PortfoliosPage | Portfolio list |
| `/portfolios/:id` | PortfolioDetailPage | Portfolio + projects |
| `/projects/:id` | ProjectDetailPage | Project + tasks |
| `/tasks/:id` | TaskDetailPage | Task details |
| `/team` | TeamPage | Team workload |
| `/templates` | TemplatesPage | Task templates |

## State Management

- **TanStack Query** - Server state (API data, caching, refetching)
- **AuthContext** - Client state (auth token, user info)

## Next Steps

### Missing Features (for full MVP)
1. **Create/Edit forms** - Portfolios, projects, tasks, templates
2. **Kanban board** - Drag-drop task status
3. **Gantt chart** - Timeline visualization
4. **Task reordering** - Drag-drop within lists
5. **Comments** - Threaded discussions
6. **User invitations** - Invite new team members
7. **Settings pages** - Profile, password change

### Enhancements
1. **Error boundaries** - Better error handling
2. **Loading skeletons** - Better loading states
3. **Toast notifications** - Success/error messages
4. **Confirmation dialogs** - Delete confirmations
5. **Form validation** - Zod + React Hook Form
6. **Infinite scroll** - For long lists
7. **Search** - Global search functionality
8. **Dark mode** - Theme toggle

## Backend Connection

The frontend expects the Laravel backend running on `http://localhost:8000`.

Vite proxy configuration in `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

This means API calls to `/api/*` are automatically forwarded to the backend during development.
