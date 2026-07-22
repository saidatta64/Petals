# 🌸 Welcome to the Petals GitHub Wiki

> **Petals** (formerly TaskFlow) is a modern, desktop-first productivity application focused on consistency, privacy, and seamless workflow management.

Built with **Electron 27**, **React 19**, **TypeScript 5**, **Tailwind CSS 3**, **SQLite**, and **Drizzle ORM**, Petals combines task management, GitHub-style contribution heatmaps, a local filesystem note-taking engine, an interactive visual canvas, real-time analytics, and native OS notifications into a single offline-first desktop environment.

---

## 🗺️ Quick Navigation

Whether you are a new user, a contributor, or an developer exploring the architecture, use the quick links below or the sidebar on the right to navigate the wiki:

| Topic | Description |
|---|---|
| 🚀 **[Getting Started](Getting-Started)** | Installation prerequisites, setup instructions, development server setup, and production packaging. |
| ✨ **[Feature Guide](Feature-Guide)** | Detailed walkthrough of Task CRUD, Heatmap, Filesystem Notepad, Canvas, Analytics, and Custom DB paths. |
| 🏗️ **[Architecture & Tech Stack](Architecture-&-Tech-Stack)** | Multi-process Electron model, React 19 + Zustand state layer, IPC bridge, and feature-based modular design. |
| 🗄️ **[Database Schema & Storage](Database-Schema-&-Storage)** | SQLite database structure, Drizzle ORM schemas, migration pipeline, and custom drive storage configuration. |
| 🔌 **[API & IPC Bridge Reference](API-&-IPC-Bridge-Reference)** | Complete reference of IPC handlers exposed on `window.taskflow` across main and renderer processes. |
| 🛠️ **[Developer Guide & Contributing](Developer-Guide-&-Contributing)** | Code conventions, feature architecture rules, npm scripts, release building, and pull request guidelines. |
| ❓ **[Troubleshooting & FAQ](Troubleshooting-&-FAQ)** | Common setup issues, native module compilation (`better-sqlite3`), Electron debugging, and performance tips. |

---

## 🌟 Key Application Highlights

- **🔒 100% Offline & Private**: All tasks, settings, heatmaps, and notes remain strictly stored on your local machine in SQLite and flat text files.
- **💾 Filesystem-Backed Notepad**: Read and edit local notes synced as `.txt` files or open external `.txt` documents from any drive on your PC.
- **🎨 Full-Bleed Creative Canvas**: Interactive visual drawing workspace designed for quick sketches, diagrams, and uninterrupted brainstorming.
- **🔥 GitHub-Style Heatmap & Streaks**: High-contrast contribution grid tracking daily task completions and maintaining active habit streaks.
- **⚙️ Custom Storage Locations**: Flexible onboarding allowing you to store your database on secondary drives (e.g. `D:\Data\taskflow.db`) to protect system C: drive capacity.
- **🔔 Native System Toasts**: Background polling triggers OS-level desktop notifications for overdue and upcoming task reminders.

---

## 🚀 Quick Start Example

```bash
# Clone the repository
git clone https://github.com/saidatta64/Petals.git
cd Petals

# Install dependencies
npm install

# Launch in Development Mode (Vite + Electron)
npm run dev
```

---

## 📚 Community & Support

- **Repository**: [saidatta64/Petals](https://github.com/saidatta64/Petals)
- **Issue Tracker**: [GitHub Issues](https://github.com/saidatta64/Petals/issues)
- **License**: [MIT License](https://github.com/saidatta64/Petals/blob/main/LICENSE)
