# 🗄️ Database Schema & Storage

Petals stores all user operational data locally in a single SQLite database (`taskflow.db`). The database is managed via **Drizzle ORM** and **Better-SQLite3**.

---

## 📐 Entity Relationship Diagram

```text
┌─────────────────┐           ┌─────────────────┐
│   categories    │ 1       * │      tasks      │
├─────────────────┤───────────┼─────────────────┤
│ id (PK)         │           │ id (PK)         │
│ name (TEXT)     │           │ title (TEXT)    │
│ color (TEXT)    │           │ category_id (FK)│
│ created_at      │           │ priority (TEXT) │
└─────────────────┘           │ status (TEXT)   │
                              │ completed_at    │
                              └────────┬────────┘
                                       │ 1
                                       │
                                       │ 0..1
                              ┌────────▼────────┐
                              │    reminders    │
                              ├─────────────────┤
                              │ id (PK)         │
                              │ task_id (FK)    │
                              │ reminder_time   │
                              │ repeat_type     │
                              └─────────────────┘

┌─────────────────┐           ┌─────────────────┐
│    settings     │           │   __drizzle__   │
├─────────────────┤           ├─────────────────┤
│ key (PK, TEXT)  │           │ id (PK)         │
│ value (TEXT)    │           │ hash            │
└─────────────────┘           └─────────────────┘
```

---

## 📊 Database Tables Specification

### 1. `categories`

Stores task categorization labels and associated hex colors.

| Column | Data Type | Nullable | Description / Default |
|---|---|---|---|
| `id` | `INTEGER` | No | Primary Key (Auto-Increment) |
| `name` | `TEXT` | No | Unique category name (e.g. *Study*, *Development*) |
| `color` | `TEXT` | No | Hex color representation (e.g. `#3B82F6`) |
| `created_at` | `INTEGER` | No | Unix timestamp of creation |

---

### 2. `tasks`

Stores main task items, priorities, completion timestamps, and recurring intervals.

| Column | Data Type | Nullable | Description / Default |
|---|---|---|---|
| `id` | `INTEGER` | No | Primary Key (Auto-Increment) |
| `title` | `TEXT` | No | Task title |
| `description` | `TEXT` | Yes | Task detailed notes/description |
| `category_id` | `INTEGER` | Yes | Foreign Key referencing `categories.id` |
| `priority` | `TEXT` | No | Priority level (`HIGH`, `MEDIUM`, `LOW`) |
| `status` | `TEXT` | No | Current status (`PENDING`, `COMPLETED`) |
| `due_date` | `INTEGER` | Yes | Target completion Unix timestamp |
| `recurring_type` | `TEXT` | Yes | Recurrence type (`NONE`, `DAILY`, `WEEKLY`, `MONTHLY`) |
| `recurring_interval` | `INTEGER` | Yes | Custom interval multiplier |
| `created_at` | `INTEGER` | No | Unix timestamp of creation |
| `updated_at` | `INTEGER` | No | Unix timestamp of last update |
| `completed_at` | `INTEGER` | Yes | Unix timestamp of task completion |

---

### 3. `reminders`

Stores notification rules linked to individual tasks.

| Column | Data Type | Nullable | Description / Default |
|---|---|---|---|
| `id` | `INTEGER` | No | Primary Key (Auto-Increment) |
| `task_id` | `INTEGER` | No | Foreign Key referencing `tasks.id` (ON DELETE CASCADE) |
| `reminder_time` | `INTEGER` | No | Unix timestamp for system notification |
| `repeat_type` | `TEXT` | No | Recurrence mode (`NONE`, `DAILY`, `WEEKLY`, `MONTHLY`, `CUSTOM`) |
| `custom_interval` | `INTEGER` | Yes | Custom repeat interval in days |
| `enabled` | `INTEGER` | No | Boolean flag (`1` = active, `0` = muted) |

---

### 4. `settings`

Key-value store for application configuration and user preferences.

| Column | Data Type | Nullable | Description |
|---|---|---|---|
| `key` | `TEXT` | No | Primary Key setting identifier |
| `value` | `TEXT` | No | JSON string or scalar setting value |

---

## ⚡ Indexing Strategy

To maintain sub-millisecond query performance on large task histories, the database creates indexes on:

```sql
CREATE INDEX idx_tasks_category_id ON tasks(category_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_completed_at ON tasks(completed_at);
CREATE INDEX idx_reminders_task_id ON reminders(task_id);
CREATE INDEX idx_reminders_reminder_time ON reminders(reminder_time);
```

---

## 💡 Dynamic Calculations Strategy

To eliminate data redundancy and prevent data drift:
- **Statistics & Heatmap Data are NOT stored in dedicated tables.**
- Daily contribution counts, current streaks, longest streaks, and completion charts are **computed dynamically** via standard SQL queries over `tasks.completed_at`.

---

## ⚙️ Custom Database Path Selection

Users can store their `taskflow.db` on any drive (e.g., secondary HDD/SSD `D:\Data\taskflow.db`):

1. The path is stored in Electron main process configuration.
2. During application startup, `electron/main.ts` retrieves or initializes the DB connection using `better-sqlite3`.
3. Changing the path via **Settings** re-initializes the connection securely.
