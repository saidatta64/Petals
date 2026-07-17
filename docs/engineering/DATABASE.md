# DATABASE.md

# TaskFlow Database Design

**Database:** SQLite

**ORM:** Drizzle ORM

**Version:** 1.0

---

# Overview

TaskFlow stores all user data locally in a single SQLite database.

Database Name:

```text
taskflow.db
```

The database is designed to be:

* Offline-first
* Lightweight
* Fast
* Normalized
* Easy to migrate
* AI-friendly

---

# Database Tables

The MVP contains only five tables:

```text
categories
tasks
reminders
settings
migrations
```

No additional tables should be created unless the product requirements change.

---

# Entity Relationship Diagram

```text
Categories (1)
      │
      │
      ▼
Tasks (Many)
      │
      │
      ▼
Reminders (0 or 1)

Settings
```

---

# Table: Categories

Purpose:

Stores task categories.

Columns

| Name       | Type    | Notes          |
| ---------- | ------- | -------------- |
| id         | INTEGER | Primary Key    |
| name       | TEXT    | Unique         |
| color      | TEXT    | Hex Color      |
| created_at | INTEGER | Unix Timestamp |

Example

```text
1  Study      #3B82F6
2  Development #22C55E
3  Production #F97316
4  Personal    #8B5CF6
```

---

# Table: Tasks

Purpose:

Stores every task.

Columns

| Name               | Type    | Notes               |
| ------------------ | ------- | ------------------- |
| id                 | INTEGER | Primary Key         |
| title              | TEXT    | Required            |
| description        | TEXT    | Nullable            |
| category_id        | INTEGER | Foreign Key         |
| priority           | TEXT    | HIGH / MEDIUM / LOW |
| status             | TEXT    | PENDING / COMPLETED |
| due_date           | INTEGER | Nullable            |
| recurring_type     | TEXT    | Nullable            |
| recurring_interval | INTEGER | Nullable            |
| created_at         | INTEGER | Required            |
| updated_at         | INTEGER | Required            |
| completed_at       | INTEGER | Nullable            |

---

Example

```text
Study DSA

Priority: HIGH

Category: Study

Completed: Today
```

---

# Table: Reminders

Purpose:

Stores reminder configuration.

Columns

| Name            | Type    | Notes                                    |
| --------------- | ------- | ---------------------------------------- |
| id              | INTEGER | Primary Key                              |
| task_id         | INTEGER | Foreign Key                              |
| reminder_time   | INTEGER | Unix Timestamp                           |
| repeat_type     | TEXT    | NONE / DAILY / WEEKLY / MONTHLY / CUSTOM |
| custom_interval | INTEGER | Nullable                                 |
| enabled         | INTEGER | Boolean                                  |

Each task has zero or one reminder.

---

# Table: Settings

Purpose:

Stores application preferences.

Columns

| Name  | Type | Notes       |
| ----- | ---- | ----------- |
| key   | TEXT | Primary Key |
| value | TEXT | JSON/String |

Examples

```text
theme

window_size

default_view

notification_enabled

sidebar_collapsed
```

---

# Relationships

```text
Category

↓

Many Tasks

↓

Optional Reminder
```

Rules

Deleting a category should not delete tasks.

Instead:

Move tasks to

```text
Other
```

Deleting a task automatically deletes its reminder.

---

# Indexes

Create indexes for:

```text
tasks.category_id

tasks.status

tasks.due_date

tasks.completed_at

reminders.task_id

reminders.reminder_time
```

These improve dashboard performance.

---

# Constraints

Category name

Unique

Task title

Required

Priority

Must be

```text
HIGH

MEDIUM

LOW
```

Status

Must be

```text
PENDING

COMPLETED
```

Repeat Type

Must be

```text
NONE

DAILY

WEEKLY

MONTHLY

CUSTOM
```

---

# Recurring Tasks

Recurring tasks are stored inside the Tasks table.

No separate recurring_tasks table.

Fields

```text
recurring_type

recurring_interval
```

Example

```text
Read Book

Daily

Interval = 1
```

When completed

↓

Automatically create

Tomorrow's task

---

# Heatmap

The database does not store heatmap data.

Instead

Generate it using

```text
completed_at
```

Example

```text
July 1

3 Tasks

↓

Heatmap Color Level 2
```

This avoids duplicated data.

---

# Statistics

Statistics are never stored.

Always calculate from:

```text
tasks.completed_at
```

Examples

Current streak

Longest streak

Completion rate

Weekly tasks

Monthly tasks

Yearly tasks

Average tasks/day

Most productive category

---

# Soft Delete

Not used.

Tasks are permanently deleted.

Categories are permanently deleted.

This keeps the MVP simple.

---

# Migrations

Use Drizzle migrations.

Each schema change must create a new migration.

Never edit previous migrations.

Example

```text
0000_initial

0001_reminders

0002_settings
```

---

# Transactions

Use transactions when:

Creating recurring tasks.

Completing tasks.

Deleting tasks with reminders.

Updating categories.

This guarantees consistency.

---

# Repository Responsibilities

Each table has one repository.

Example

```text
TaskRepository

CategoryRepository

ReminderRepository

SettingsRepository
```

Repositories only:

Create

Read

Update

Delete

No business logic.

---

# Data Validation

Validate before database writes.

Examples

Task title cannot be empty.

Category must exist.

Priority must be valid.

Reminder date must be in the future for one-time reminders.

Repeat interval must be greater than zero.

---

# Backup Strategy

The entire application is backed up by copying:

```text
taskflow.db
```

No export format is required for the MVP.

Future versions may add import/export.

---

# Performance Guidelines

Use indexed queries.

Avoid SELECT * where unnecessary.

Load only required columns.

Batch updates where possible.

Never perform database operations inside React components.

---

# Future Expansion

The schema is intentionally simple but can support future additions such as:

* Cloud synchronization
* Tags
* Attachments
* Multiple workspaces

These are not part of the MVP and should not affect the current schema.

---

# Database Principles

* One SQLite database.
* One responsibility per table.
* Normalize data where practical.
* Calculate statistics instead of storing them.
* Store only essential information.
* Keep the schema simple, predictable, and easy to maintain.
