# Petals

A desktop-first productivity application focused on helping users stay consistent through simple task management, recurring reminders, a local notepad, drawing canvas, and GitHub-style contribution heatmaps.

## Features

- Onboarding dialog for custom user name and **Database Storage Location Choice** (avoiding C: drive space limits)
- **Filesystem-Backed Notepad** with local folder synchronization (saved as real `.txt` files)
- **External Text File Support**: Open, view, edit, and save any `.txt` file from your computer in the editor
- Markdown formatting helper toolbar (Headings, Lists, Bold, Italic, Strikethrough, Links)
- **Full-Bleed UI Layout**: Notepad and Visual Drawing Canvas (Excalidraw & tldraw) fill 100% viewport flush
- Task Management with full CRUD (High, Medium, Low priority)
- Categories with custom color coding
- Dashboard with streaks, habits, and productivity charts
- **Native Laptop Notifications** (completed tasks and background task reminders polling)
- Offline-first local SQLite database with Drizzle ORM
- Dark mode support

## Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop | Electron 27 |
| Frontend | React 18 + TypeScript |
| Bundler | Vite 5 |
| Styling | Tailwind CSS |
| State | Zustand |
| Database | SQLite + Drizzle ORM (Better-SQLite3) |
| Validation | Zod |

## Project Structure

```text
task-flow/
├── docs/                  # Product & engineering documentation
│   ├── product/           # PRD
│   ├── engineering/       # Architecture, database, tasks
│   └── design/            # UI guidelines
├── electron/              # Main process & preload
├── src/
│   ├── app/               # Root application component
│   ├── features/          # Feature modules (dashboard, tasks)
│   ├── shared/            # Shared components, stores, types
│   ├── database/          # Schema, repositories, services
│   └── styles/            # Global CSS
├── index.html
└── PROJECT_STATUS.md      # Development progress tracker
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development (Vite + Electron)
npm run dev

# Type check
npm run type-check

# Production build
npm run build
```

## Documentation

All project documentation lives in [`docs/`](docs/README.md). Read these before contributing:

- [PRD](docs/product/PRD.md) — Product requirements
- [Architecture](docs/engineering/ARCHITECTURE.md) — System design
- [Database](docs/engineering/DATABASE.md) — Schema & repositories
- [Tasks](docs/engineering/TASKS.md) — Implementation milestones
- [UI Guidelines](docs/design/UI_GUIDELINES.md) — Design system

## License

MIT
