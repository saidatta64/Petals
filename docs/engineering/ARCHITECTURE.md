# ARCHITECTURE.md

# TaskFlow System Architecture

**Version:** 1.0

---

# Overview

TaskFlow is a **desktop-first, offline productivity application** built using Electron, React, TypeScript, SQLite, and Drizzle ORM.

The architecture follows a **layered, feature-based design** that separates the user interface, business logic, database, and Electron APIs.

Every layer has a single responsibility.

```
┌─────────────────────────────┐
│        React Renderer       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Zustand Stores        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      Feature Services       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       IPC (Preload)         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     Electron Main Process   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        Repositories         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      SQLite + Drizzle       │
└─────────────────────────────┘
```

---

# Design Principles

The architecture is built around these principles:

* Offline First
* Feature Based
* Single Responsibility
* Strong Type Safety
* Minimal Coupling
* High Cohesion
* Secure IPC Communication
* Maintainability
* Scalability

---

# Application Layers

## 1. Renderer Layer

Technology:

* React
* TypeScript
* TailwindCSS

Responsibilities:

* Display UI
* Handle user interaction
* Call stores
* Never access SQLite directly
* Never call Electron APIs directly

The renderer should contain **zero business logic**.

---

## 2. State Layer

Technology:

* Zustand

Responsibilities:

* Global application state
* Task state
* Category state
* Dashboard state
* Settings state

The store should never contain database logic.

It only manages state.

---

## 3. Service Layer

Responsibilities:

* Business logic
* Validation
* Task completion logic
* Statistics generation
* Streak calculation
* Reminder scheduling
* Heatmap generation

Services coordinate between the UI and repositories.

---

## 4. IPC Layer

Electron uses secure IPC communication.

Flow:

```
React

↓

window.taskflow

↓

Preload

↓

IPC

↓

Main Process
```

The renderer must never import Electron directly.

All communication happens through the preload bridge.

---

## 5. Main Process

Responsibilities:

* Database access
* Notifications
* File system
* Window management
* IPC handlers

The Main Process never renders UI.

---

## 6. Repository Layer

Repositories are responsible only for database operations.

Examples:

```
TaskRepository

CategoryRepository

ReminderRepository

SettingsRepository
```

Repositories never contain UI logic.

Repositories never calculate statistics.

---

## 7. Database Layer

Technology:

SQLite

ORM:

Drizzle

Responsibilities:

* Store data
* Execute queries
* Maintain relationships
* Migrations

Nothing else.

---

# Feature Architecture

Each feature owns its own code.

```
features/

tasks/

categories/

dashboard/

statistics/

heatmap/

calendar/

reminders/

settings/
```

Every feature contains:

```
components/

hooks/

services/

types/

utils/
```

No feature should depend directly on another feature.

Shared functionality belongs in:

```
shared/
```

---

# Folder Structure

```
taskflow/

docs/

electron/

main/

preload/

ipc/

src/

app/

components/

features/

hooks/

stores/

services/

database/

repositories/

types/

utils/

styles/

assets/
```

---

# Data Flow

Creating a task:

```
User

↓

Task Form

↓

Task Store

↓

Task Service

↓

IPC

↓

Task Repository

↓

SQLite

↓

Success

↓

UI Updates
```

Reading tasks:

```
SQLite

↓

Repository

↓

IPC

↓

Service

↓

Store

↓

React UI
```

---

# Notification Flow

```
Reminder Time

↓

Electron Main

↓

Native Notification

↓

User Clicks

↓

IPC Event

↓

Task Updated

↓

Dashboard Refresh

↓

Heatmap Refresh
```

---

# Statistics Flow

Statistics are **never stored**.

They are calculated from completed task history.

```
Completed Tasks

↓

Statistics Service

↓

Dashboard

↓

Charts
```

---

# Heatmap Flow

```
Completed Task

↓

Task Repository

↓

Heatmap Service

↓

Contribution Data

↓

Heatmap Component
```

The heatmap always reflects real task completion history.

---

# State Management

Each major domain has its own Zustand store.

Example:

```
taskStore

categoryStore

dashboardStore

settingsStore
```

Stores only manage application state.

Business rules belong in Services.

---

# Component Hierarchy

```
App

Sidebar

Main Layout

Dashboard

Today's Tasks

Task List

Task Card

Task Dialog

Reminder Dialog

Heatmap

Calendar

Statistics

Settings
```

Every component has one responsibility.

---

# Routing

Desktop navigation only.

Views:

```
Dashboard

Today's Tasks

Upcoming

Completed

Categories

Calendar

Statistics

Settings
```

No browser-style routing.

---

# Error Handling

Every layer handles only its own errors.

Example:

Database errors

↓

Repository

↓

Service

↓

UI Message

The UI never receives raw SQL errors.

---

# Security

Electron configuration must use:

* Context Isolation
* Sandbox Enabled
* Node Integration Disabled
* Secure Preload APIs
* Validated IPC Messages

The renderer cannot access Node.js directly.

---

# Local Storage

All application data is stored locally.

Storage includes:

* Tasks
* Categories
* Reminders
* Recurring Rules
* Settings

Statistics and heatmaps are generated dynamically from task history whenever possible rather than stored as separate data.

---

# Performance Guidelines

* Lazy load feature views.
* Memoize expensive calculations.
* Keep components focused.
* Avoid unnecessary re-renders.
* Query the database only through repositories.
* Never block the UI thread.

---

# Logging

Log only:

* Database errors
* IPC failures
* Notification failures
* Unexpected exceptions

Do not log routine user actions.

---

# Testing Strategy

Focus tests on:

* Services
* Repositories
* Reminder scheduling
* Statistics calculations
* Heatmap generation

UI tests are limited to critical user interactions.

---

# Guiding Principle

Every architectural decision should make the application:

* Simple to understand
* Easy to maintain
* Fast to use
* Secure
* Offline-first
* Modular
* Easy for AI agents and developers to extend without breaking existing functionality
