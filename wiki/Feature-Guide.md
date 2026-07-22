# ✨ Petals Feature Guide

Petals combines essential daily workflow tools into a unified, privacy-focused desktop application. This document details each major feature module, how it operates, and its underlying design.

---

## 1. 📅 Task & Category Management

Petals provides a feature-complete task tracking ecosystem designed for minimal friction and clear prioritization.

### Key Capabilities
- **Full CRUD Operations**: Add, view, edit, complete, and delete tasks.
- **Categorization**: Assign tasks to color-coded categories (*Study*, *Development*, *Production*, *Personal*, or custom user categories).
- **Prioritization Levels**: Classify tasks by priority (*High*, *Medium*, *Low*) with visual indicator badges.
- **Subtasks & Checklists**: Break complex tasks into manageable subtask checklist items.
- **Rich Descriptions & Due Dates**: Add context and schedule specific target completion dates.
- **Task Filters & Search**: Filter task lists by status (*Pending*, *Completed*), category, or keyword search.

---

## 2. 🔥 Contribution Heatmap & Streak Tracker

Inspired by GitHub's contribution graph, Petals tracks daily productivity visually over time.

### Heatmap Mechanics
- **Dynamic Color Levels**: Task completion count maps dynamically to high-contrast theme-aware green cells (Level 0 through Level 4).
- **Streak Calculation**: Tracks **Current Streak** (consecutive active days with completed tasks) and **Longest Streak**.
- **Historical Activity Grid**: Displays full-year grid views with interactive tooltips showing date and exact completion count.
- **Dark/Light Mode Adaptive**: Color palettes dynamically adjust to ensure readability across light and dark application themes.

---

## 3. 📝 Filesystem-Backed Notepad & External File Editor

Unlike traditional apps that store notes inside proprietary databases, Petals acts as a true local text manager.

### Features & Capabilities
- **Real `.txt` File Sync**: Internal app notes are saved directly as `.txt` files in your user notes directory.
- **External File Editor**: Open, edit, format, and save any existing `.txt` file on your local machine using native Electron file dialogs.
- **Formatting Toolbar**: Markdown formatting helpers for Headings (`#`), Bold (`**`), Italic (`*`), Strikethrough (`~~`), Bullet Lists (`-`), and Links.
- **Open in File Explorer**: One-click action to view note files directly inside Windows File Explorer / OS file manager.
- **Full-Bleed Interface**: The notepad viewport scales 100% flush within the window shell for a distaction-free writing experience.

---

## 4. 🎨 Visual Drawing Canvas

Petals includes a lightweight, full-bleed interactive canvas for visual thinker and visual planning.

### Canvas Features
- **Unconstrained Canvas Workspace**: Interactive canvas for sketching diagrams, flowcharts, and quick ideas.
- **Drawing Tools**: Freehand brush tool, erasing modes, stroke thickness adjustment, and color picker.
- **Viewport Scaling**: 100% flush canvas layout with zero inner padding for seamless creative work.

---

## 5. 📊 Analytics & Recharts Productivity Dashboard

The Dashboard provides at-a-glance visualization of your productivity metrics over time.

### Analytics Breakdown
- **Weekly Completion Chart**: High-resolution bar graph built with **Recharts** displaying daily task completion totals.
- **Category Breakdown**: Pie & donut charts showing time distribution across different task categories.
- **Productivity Summary Cards**: Total tasks completed, overall completion percentage, active streak, and top productive category.
- **Customizable Widgets**: Rearrangeable widget grid for fast access to quick tasks, streaks, and upcoming reminders.

---

## 6. 🔔 Native OS Notifications & Reminders

Stay on top of deadlines with background system alerts.

### Reminder Engine
- **Task Reminders**: Attach target reminder timestamps to tasks.
- **Native OS Toasts**: Background Electron polling sends system toast notifications when reminders trigger.
- **Overdue Alerts**: Highlights past-due tasks in red with options to reschedule or complete directly.

---

## 7. ⚙️ Offline Storage & Custom Database Directory

Keep full control over where your data lives.

### Storage Control
- **100% Local SQLite**: Powered by `better-sqlite3` and `drizzle-orm` for high performance with zero latency.
- **Custom DB Storage Directory**: Select your database destination during onboarding or anytime in **Settings**. Useful for keeping data on secondary drives (e.g. `D:\Data\`) to preserve space on system drives.
