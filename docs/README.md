# TaskFlow

A desktop-first productivity application focused on helping users stay consistent through simple task management, recurring reminders, and GitHub-style contribution heatmaps.

TaskFlow is built for people who want to focus on **doing today's work** while visualizing long-term progress.

---

# Features

* Task Management
* Categories
* Priority Levels
* Native Desktop Notifications
* Recurring Tasks
* Dashboard
* GitHub-style Heatmap
* Calendar View
* Productivity Statistics
* Streak Tracking
* Search & Filters
* Dark Mode
* Offline-first
* Local SQLite Database

---

# Technology Stack

### Desktop

Electron

### Frontend

React

TypeScript

Vite

Tailwind CSS

### State Management

Zustand

### Database

SQLite

Drizzle ORM

### Validation

Zod

### Charts

Recharts

### Heatmap

react-activity-calendar

### Date Utilities

date-fns

---

# Project Structure

```text id="b3gzma"
TaskFlow/

docs/

PRD.md
AGENTS.md
ARCHITECTURE.md
DATABASE.md
UI_GUIDELINES.md
TASKS.md

electron/

src/

assets/

package.json
```

---

# Development

Install dependencies

```bash
npm install
```

Start development

```bash
npm run dev
```

Start Electron

```bash
npm run electron
```

---

# Build

Production build

```bash
npm run build
```

Package application

```bash
npm run dist
```

---

# Database

The application stores all information locally using SQLite.

Database

```text id="q1tz2t"
taskflow.db
```

No internet connection is required.

No user account is required.

No cloud storage is used.

---

# Architecture

The project follows a layered architecture.

```text id="6oqdkt"
React UI

↓

Zustand

↓

Services

↓

Electron IPC

↓

Repositories

↓

SQLite
```

Refer to:

```text id="rr6g1s"
docs/ARCHITECTURE.md
```

for complete details.

---

# Documentation

Project documentation is located in

```text id="6ufdrd"
docs/
```

Contains

```text id="65jplv"
PRD.md

AGENTS.md

ARCHITECTURE.md

DATABASE.md

UI_GUIDELINES.md

TASKS.md
```

Every AI coding agent should read these documents before writing code.

---

# Product Goals

TaskFlow is designed to:

* Reduce friction when managing daily work.
* Encourage consistency through visual feedback.
* Keep all data private and local.
* Remain fast and lightweight.
* Avoid unnecessary complexity.

---

# Contributing

Before implementing new functionality:

1. Read `PRD.md`.
2. Follow `AGENTS.md`.
3. Respect the architecture.
4. Follow the UI guidelines.
5. Complete tasks from `TASKS.md`.

---

# License

This project is licensed under the MIT License.

---

# Philosophy

> Small daily wins create long-term consistency.

TaskFlow exists to help users focus on today's work while building habits that last.
