# 🏗️ Architecture & Tech Stack

Petals is designed as a **desktop-first, offline-first productivity application**. It enforces a strict separation of concerns across its UI, state management, Electron IPC main process, and database layers.

---

## 🛠️ Technology Stack Overview

| Layer | Technology | Purpose |
|---|---|---|
| **Desktop Runtime** | [Electron 27](https://www.electronjs.org/) | Desktop window container, OS file access, IPC, native notifications |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) | Declarative user interface, strict type safety |
| **Bundler & Dev Server**| [Vite 5](https://vitejs.dev/) | High-speed Hot Module Replacement (HMR) and optimized frontend production bundles |
| **UI Components & Icons**| [HeroUI 3](https://heroui.com/) + [Lucide React](https://lucide.dev/) | Modern dark/light mode UI components and crisp iconography |
| **Styling & Motion** | [Tailwind CSS 3](https://tailwindcss.com/) + [Framer Motion 12](https://www.framer.com/motion/) | Utility-first styling and smooth UI transitions |
| **State Management** | [Zustand 4](https://github.com/pmndrs/zustand) | Lightweight, decoupled global application state stores |
| **Data Visualization** | [Recharts 3](https://recharts.org/) | Interactive charts for weekly trends and category distributions |
| **Database & ORM** | [SQLite 3](https://www.sqlite.org/) + [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) + [Drizzle ORM](https://orm.drizzle.team/) | Fast local relational database with type-safe schema queries |
| **Validation** | [Zod 3](https://zod.dev/) | Runtime data schema validation |

---

## 🏛️ Layered System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                 React 19 Renderer Process                   │
│          (UI Views, HeroUI Components, Recharts)            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Zustand State Layer                       │
│     (taskStore, categoryStore, settingsStore, noteStore)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  IPC Preload Bridge Layer                   │
│          (contextBridge exposing window.taskflow)           │
└──────────────────────────────┬──────────────────────────────┘
                               │ (IPC Invoke / Handle)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Electron Main Process                     │
│    (Window management, IPC handlers, File System, OS Toasts)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Repository Layer                         │
│   (TaskRepository, CategoryRepository, SettingsRepository)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                SQLite Database + Drizzle ORM                │
│                 (taskflow.db SQLite storage)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Architecture

Petals adheres to Electron security best practices:

- **Node Integration Disabled**: `nodeIntegration: false` ensures malicious scripts in the renderer cannot access Node.js modules.
- **Context Isolation Enabled**: `contextIsolation: true` isolates preload scripts from the website/renderer execution context.
- **Preload Bridge**: All IPC communications are explicitly exposed via `contextBridge.exposeInMainWorld('taskflow', api)`.
- **Input Validation**: Main process handlers validate all incoming payload data via **Zod** prior to SQL execution or file modification.

---

## 📦 Feature-Based Modular Architecture

Code in `src/` is structured around feature modules rather than technical file types:

```text
src/
├── app/                    # Main application providers, router & layout shell
│   ├── layout/             # Sidebar, MinimalHeader, HeaderNotifications
│   └── providers/          # Theme & state providers
├── database/               # SQLite connection setup, Drizzle schemas & repositories
│   ├── schema/             # Drizzle tables (tasks, categories, reminders, settings)
│   ├── repositories/       # Isolated DB query repositories
│   └── index.ts            # DB initializer
├── features/               # Independent feature modules
│   ├── calendar/           # Calendar view & scheduling
│   ├── dashboard/          # Dashboard summary grid
│   ├── heatmap/            # Contribution heatmap view & stats
│   ├── notepad/            # Local .txt note editor & toolbar
│   ├── settings/           # User preferences & DB path picker
│   ├── statistics/         # Recharts charts & metrics
│   ├── tasks/              # Task CRUD, filters, priority & subtasks
│   ├── visuals/            # Drawing canvas workspace
│   └── widgets/            # Dashboard widgets
└── shared/                 # Common components, hooks, stores & types
```

---

## 🔄 Data Flow Pipeline

### Task Creation Flow

```text
User Submits Task Form
       │
       ▼
React Form Component calls taskStore.createTask()
       │
       ▼
Zustand Store calls window.taskflow.tasks.create(input)
       │
       ▼
IPC Channel ('task:create') invokes Electron Main process handler
       │
       ▼
TaskRepository executes Drizzle insert query on taskflow.db
       │
       ▼
Database returns newly created Task entity
       │
       ▼
State Store updates local React state -> UI re-renders automatically
```
