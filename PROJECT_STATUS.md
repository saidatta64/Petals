# Petals Project Status

Version: 1.1

Last Updated: 2026-07-17 23:15

---

# Project Overview

Project Name:
Petals (formerly TaskFlow)

Current Version:
1.0.0

Status:
✅ Production Ready / Completed

Current Phase:
Deployment & Testing

Current Milestone:
Milestone 15 – Production Build

Overall Progress:
100%

---

# Project Documentation

Documentation Status

| Document | Status |
|----------|--------|
| PRD.md | ✅ Complete |
| AGENTS.md | ✅ Complete |
| ARCHITECTURE.md | ✅ Complete |
| DATABASE.md | ✅ Complete |
| UI_GUIDELINES.md | ✅ Complete |
| COMPONENTS.md | ✅ Complete |
| TASKS.md | ✅ Complete |
| README.md | ✅ Complete |

---

# Milestone Progress

## Milestone 1 – Project Setup
- **Status:** ✅ Complete
- **Tasks:** Setup Electron, React, TypeScript, Tailwind, Zustand, SQLite, Drizzle, Builder, and Prettier configurations.

## Milestone 2 – Database
- **Status:** ✅ Complete
- **Tasks:** Schemas, Migrations, Repositories, default categories seeding.

## Milestone 3 – IPC
- **Status:** ✅ Complete
- **Tasks:** Preload scripts, secure bridge, database and notifications IPC handlers.

## Milestone 4 to 13 – Features Implementation
- **Status:** ✅ Complete
- **Tasks:** Tasks CRUD, Categories, Reminders, Calendar, Heatmap, Statistics, Dashboard, Notepad, Canvas, and Settings views.

## Milestone 14 – Testing & Polish
- **Status:** ✅ Complete
- **Tasks:** Type-checking, dark mode heatmap alignment, full-bleed container styling, weekly stats graph layout bugfix.

## Milestone 15 – Production Build
- **Status:** ✅ Complete
- **Tasks:** Electron packaging, app icons mapping (`icon.png` and `logo.png`).

---

# Current Architecture

Desktop: Electron 27
Frontend: React 18
Language: TypeScript
Bundler: Vite 5
Styling: TailwindCSS
State: Zustand
Database: SQLite + Drizzle ORM
Validation: Zod

---

# Current Folder Structure

```text
task-flow/
├── assets/                # App asset icons
├── dist/                  # Compiled production build
├── electron/              # Electron main and preload processes
├── public/                # Favicon and logo assets
├── src/
│   ├── app/               # Main layout and routing
│   ├── database/          # SQLite schema, repos, services
│   ├── features/          # Dashboard, notepad, tasks, statistics
│   └── shared/            # Common UI elements and Zustand stores
├── index.html
├── package.json
└── README.md
```

---

# Database Status

Database: ✅ Created
Tables:
- ✅ Categories (seeded default)
- ✅ Tasks
- ✅ Reminders
- ✅ Settings
- ✅ Migrations

---

# Completed Features

- **Onboarding Setup:** Welcome screen setting username and SQLite database location choice.
- **Custom Database Location:** Option to change `taskflow.db` path to any drive (e.g. D: drive) to protect C: storage.
- **Local Filesystem Notepad:** Plain text editor syncing notes as real `.txt` files on disk.
- **External File Editor:** Read/write any `.txt` file on the computer from the interface.
- **Full-Page Layout (Bleed):** Notepad and Visual Drawing Canvas (Excalidraw/tldraw) scale 100% flush.
- **Weekly Completion chart:** Full-height bar charts tracking weekly completions.
- **Native Laptop Toasts:** Background polling and task completion trigger native Windows/OS notifications.
- **Theme-aware Heatmaps:** Contrast-rich light & dark green grid cells.

---

# Next Tasks
- None. All features are fully implemented, debugged, and verified.

---

# Technical Decisions Log
- **2026-07-16:** Selected SQLite instead of PostgreSQL for offline-first, zero-setup desktop architecture.
- **2026-07-17:** Switched local notes to a filesystem-backed flat file strategy (.txt) for user portability.
- **2026-07-17:** Swapped Electron `setAppDetails` for `setAppUserModelId` to support newer Electron versions on Windows.
