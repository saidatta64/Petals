# 🌸 Petals

> **A modern, desktop-first productivity application focused on consistency, privacy, and seamless workflow management.**

Petals (formerly TaskFlow) is a feature-rich desktop productivity environment built with **Electron**, **React 19**, **TypeScript**, and **Tailwind CSS**. It combines task management, GitHub-style contribution heatmaps, local filesystem note-taking, a visual drawing canvas, interactive statistics, and native OS notifications into a single offline-first application.

---

## 🌟 Key Features

### 📅 Task & Category Management
- **Full CRUD Operations**: Easily create, update, complete, and organize daily tasks.
- **Priority & Categorization**: Group tasks with customizable color-coded categories and set priorities (*High*, *Medium*, *Low*).
- **Subtasks & Descriptions**: Add detailed notes and subtask checklists to stay focused.

### 🔥 Contribution Heatmap & Streaks
- **GitHub-Style Heatmap**: Visual contribution grid tracking your daily completed tasks and productivity trends over time.
- **Streak Tracker**: Monitor current and longest completion streaks to build lasting habits.
- **Theme-Aware Color Grids**: High-contrast, theme-adaptive heatmap visuals in both light and dark modes.

### 📝 Filesystem-Backed Notepad & External File Editor
- **Real File Synchronization**: Notes are saved directly as `.txt` files on your local drive for maximum data portability.
- **External File Support**: Open, edit, format, and save any existing `.txt` file on your computer.
- **Formatting Toolbar**: Markdown quick-formatting helpers (Headings, Lists, Bold, Italic, Strikethrough, Links).

### 🎨 Visual Drawing Canvas
- **Full-Bleed Drawing Space**: Interactive canvas for sketches, diagrams, and quick visual brainstorms.
- **Seamless Viewport Scaling**: 100% flush interface for uninterrupted creative workflows.

### 📊 Dashboard & Analytics
- **Recharts Integration**: Visual analytics including weekly completion trends, task category breakdowns, and streak statistics.
- **Interactive Widgets**: Customizable dashboard cards and widget grids for at-a-glance productivity tracking.

### 🔔 Native Notifications & Reminders
- **Native OS Toasts**: Background polling triggers system toast notifications for upcoming and overdue task reminders.
- **Custom Sound & Alerts**: Native desktop integration via Electron IPC handlers.

### ⚙️ Offline-First & Storage Control
- **Local SQLite Database**: Powered by **Better-SQLite3** and **Drizzle ORM** for ultra-fast, local performance without cloud lock-in.
- **Custom Database Path**: Choose your database location during onboarding (e.g., secondary drive) to prevent C: drive capacity limits.
- **Dark & Light Mode**: Sleek UI design using **HeroUI** and **Framer Motion** transitions.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Desktop Runtime** | [Electron 27](https://www.electronjs.org/) |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Bundler & Tooling** | [Vite 5](https://vitejs.dev/) |
| **UI Components & Icons**| [HeroUI](https://heroui.com/) + [Lucide React](https://lucide.dev/) |
| **Styling & Motion** | [Tailwind CSS 3](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) |
| **Data Visualization** | [Recharts 3](https://recharts.org/) |
| **State Management** | [Zustand 4](https://github.com/pmndrs/zustand) |
| **Database & ORM** | [SQLite 3](https://www.sqlite.org/) + [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) + [Drizzle ORM](https://orm.drizzle.team/) |
| **Validation** | [Zod](https://zod.dev/) |

---

## 📁 Project Structure

Petals follows a clean, feature-based modular architecture:

```text
petals/
├── assets/                 # App icons and packaging resources
├── docs/                   # Engineering & product documentation
│   ├── design/             # UI guidelines & component docs
│   ├── engineering/        # Architecture, DB schema, tasks & milestones
│   └── product/            # Product Requirements Document (PRD)
├── electron/               # Main process, preload scripts, & IPC bridge handlers
├── public/                 # Static public assets (logos, favicons)
├── src/
│   ├── app/                # Main application entry, providers & layout shell
│   ├── database/           # SQLite setup, Drizzle schemas, repositories & seeds
│   ├── features/           # Feature modules
│   │   ├── calendar/       # Calendar view & schedule management
│   │   ├── dashboard/      # Main overview & widget grid
│   │   ├── heatmap/        # Contribution heatmap & activity grids
│   │   ├── notepad/        # Local .txt note editor & toolbar
│   │   ├── settings/       # User settings, DB path & theme options
│   │   ├── statistics/     # Recharts analytics & metrics
│   │   ├── tasks/          # Task CRUD, filters, priority & categories
│   │   ├── visuals/        # Visual drawing canvas workspace
│   │   └── widgets/        # Streak & quick-action dashboard widgets
│   ├── shared/             # Reusable components, hooks, stores & types
│   ├── styles/             # Global CSS and Tailwind imports
│   └── main.tsx            # React application entry point
├── index.html              # HTML shell
├── package.json            # Dependencies and npm scripts
├── vite.config.ts          # Vite build configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/saidatta64/Petals.git
   cd Petals
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Launch in Development Mode**:
   ```bash
   npm run dev
   ```
   *This starts Vite dev server and launches Electron concurrently.*

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Runs Vite dev server and launches Electron desktop app in live-reload mode |
| `npm run build` | Builds the production Vite renderer bundle, compiles Electron TypeScript, and packages the desktop app via `electron-builder` |
| `npm run build:renderer` | Compiles only the Vite frontend renderer |
| `npm run build:electron` | Compiles the Electron main process TypeScript (`tsconfig.node.json`) |
| `npm run preview` | Previews the production Vite build locally |
| `npm run type-check` | Runs TypeScript type checking across both React renderer and Electron process |
| `npm run lint` | Runs ESLint across `src/` and `electron/` |

---

## 📚 Documentation

Internal engineering specifications and design notes are kept locally in the `docs/` directory (excluded from repository tracking via `.gitignore`).


---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
