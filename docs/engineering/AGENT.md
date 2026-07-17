# AGENTS.md

# TaskFlow AI Development Guide

Version: 2.0

---

# Purpose

This document defines the engineering rules that every AI coding agent must follow while contributing to TaskFlow.

The Product Requirements Document (PRD) defines **what** should be built.

This document defines **how** it should be built.

Every implementation decision must comply with this document.

---

# AI Mission

Your responsibility is not to invent software.

Your responsibility is to faithfully implement the product described in the documentation.

You are expected to:

- Follow the PRD exactly.
- Respect the architecture.
- Produce maintainable code.
- Prefer simplicity over cleverness.
- Reuse existing code whenever possible.

Do not add features that were not requested.

---

# Documentation Priority

When documents conflict, follow this priority.

1. PRD.md

2. AGENTS.md

3. ARCHITECTURE.md

4. DATABASE.md

5. UI_GUIDELINES.md

6. COMPONENTS.md

7. TASKS.md

Never ignore a higher priority document.

---

# Product Philosophy

TaskFlow exists for one purpose.

Help users consistently complete today's work.

The application is not:

- Project management software
- Collaboration software
- Note-taking software
- Knowledge management software

Never allow the project to drift away from its core purpose.

---

# Development Principles

Every decision should improve one of these:

- Simplicity
- Maintainability
- Reliability
- Performance
- Consistency

Never optimize for unnecessary flexibility.

---

# Technology Stack

Desktop

Electron

Renderer

React

Language

TypeScript

Bundler

Vite

Styling

TailwindCSS

State

Zustand

Database

SQLite

ORM

Drizzle ORM

Validation

Zod

Charts

Recharts

Heatmap

react-activity-calendar

Dates

date-fns

Do not introduce additional frameworks without approval.

---

# General Rules

Always:

Write readable code.

Write strongly typed code.

Keep functions focused.

Reuse existing utilities.

Prefer composition over inheritance.

Prefer explicit code over clever code.

Avoid unnecessary abstractions.

Never:

Use `any`.

Mix UI and business logic.

Duplicate functionality.

Create dead code.

Leave TODO comments in production code.

Ignore TypeScript errors.

Suppress ESLint warnings without reason.

---

# AI Behaviour

Before writing code:

Read all project documentation.

Understand the affected feature.

Identify reusable components.

Check existing utilities.

Plan the implementation.

Only then begin coding.

Never immediately generate code.

---

# AI Workflow

For every task:

Understand the requirement.

Review the architecture.

Identify affected files.

Implement.

Run type checks.

Run linting.

Verify functionality.

Only then continue.

---

# Project Goals

Optimize for:

Fast startup.

Fast task creation.

Fast task completion.

Reliable reminders.

Consistent UI.

Maintainable architecture.

Offline operation.

---

# Definition of Good Code

Good code is:

Simple.

Readable.

Predictable.

Typed.

Modular.

Reusable.

Small.

Testable.

Good code is not:

Complex.

Over-engineered.

Clever.

Verbose.

Duplicated.

Magic.

# Project Structure

The project follows a Feature-First Architecture.

The folder structure is fixed.

Do not reorganize it without explicit approval.

```

```text
TaskFlow/

docs/

product/
    PRD.md

engineering/
    AGENTS.md
    ARCHITECTURE.md
    DATABASE.md
    COMPONENTS.md
    TASKS.md

design/
    UI_GUIDELINES.md

README.md

electron/
    main/
    preload/
    ipc/

src/

features/
    dashboard/
    tasks/
    categories/
    reminders/
    calendar/
    heatmap/
    statistics/
    settings/

shared/
    components/
    hooks/
    lib/
    stores/
    types/
    utils/

database/

assets/
```

```md

Never create additional top-level folders unless absolutely necessary.

---

# Feature Architecture

Every feature owns its own code.

Example

```

```text
features/

tasks/

components/

hooks/

services/

types/

utils/
```

```md

Features should communicate through services and shared utilities.

Never import one feature's internal components directly into another feature.

---

# Shared Folder

The shared folder contains reusable code only.

Examples:

Buttons

Inputs

Modal

Dropdown

Typography

Utilities

Validation

Custom Hooks

Types

Never place business logic here.

---

# React Rules

Use only Functional Components.

Use React Hooks.

Prefer composition over inheritance.

Keep components focused.

Target component size:

Less than 250 lines.

Split components when they become difficult to understand.

Never place database logic inside React components.

Never call SQLite directly.

Never use Electron APIs directly.

---

# Component Rules

Each component should have one responsibility.

Examples

TaskCard

Displays one task.

TaskList

Displays multiple TaskCards.

DashboardHeader

Displays dashboard summary.

StatisticsChart

Displays one chart.

Avoid components that perform multiple unrelated responsibilities.

---

# State Management

Use Zustand.

Create separate stores for:

Task Store

Category Store

Dashboard Store

Settings Store

Stores only manage application state.

Business logic belongs inside Services.

Repositories never update Zustand directly.

---

# Service Layer

Services contain business rules.

Examples

TaskService

ReminderService

StatisticsService

HeatmapService

CalendarService

Responsibilities

Validation

Business logic

Data transformation

Calculations

Services communicate with repositories.

Services never render UI.

---

# Repository Layer

Repositories perform CRUD only.

Allowed operations

Create

Read

Update

Delete

Repositories never

Calculate statistics

Generate reminders

Update UI

Call Electron APIs

Repositories only interact with SQLite.

---

# TypeScript Rules

Enable strict mode.

Never use

```

```ts
any
```

```md

Prefer

Interfaces

Utility Types

Generics

Union Types

Use enums only where they improve readability.

Every exported function must have explicit parameter and return types.

No implicit any.

---

# File Naming

Components

PascalCase

```

```text
TaskCard.tsx

Dashboard.tsx

Sidebar.tsx
```

```md

Hooks

camelCase

```

```text
useTasks.ts

useReminder.ts
```

```md

Stores

```

```text
taskStore.ts

settingsStore.ts
```

```md

Repositories

```

```text
TaskRepository.ts

ReminderRepository.ts
```

```md

Services

```

```text
TaskService.ts

HeatmapService.ts
```

```md

Types

```

```text
task.ts

category.ts
```

```md

---

# Electron Rules

Use Context Isolation.

Disable Node Integration.

Use Secure Preload.

Use IPC.

Never expose filesystem access.

Never expose SQLite directly.

Renderer communicates only through preload APIs.

---

# IPC Rules

Flow

```

```text
React

↓

window.taskflow

↓

Preload

↓

IPC

↓

Electron Main

↓

Repository

↓

SQLite
```

```md

Never bypass this flow.

Never import Electron into React.

Every IPC request must be validated.

---

# Database Rules

Use SQLite.

Use Drizzle ORM.

One database.

One migration history.

No raw SQL inside React.

Repositories are the only layer allowed to access the database.

Always use transactions when multiple related writes occur.

# Error Handling

Every layer handles only its own errors.

Example:

SQLite Error

↓

Repository

↓

Service

↓

User-Friendly Message

The UI must never receive raw database or system errors.

Always log technical details internally and display understandable messages to the user.

---

# Validation

Every input must be validated before processing.

Validate:

- Task creation
- Category creation
- Reminder creation
- Settings updates
- IPC messages

Use Zod schemas.

Never trust renderer input.

---

# Logging

Only log important events.

Examples:

Database failures

IPC failures

Notification failures

Unexpected exceptions

Do not log normal user interactions.

Do not print debug logs in production.

---

# Performance Rules

The application should feel instant.

Guidelines:

- Lazy load feature pages.
- Memoize expensive calculations.
- Never block the UI thread.
- Avoid unnecessary re-renders.
- Avoid repeated database queries.
- Cache derived values where appropriate.
- Generate statistics efficiently.

Always optimize for perceived performance.

---

# Security Rules

Electron applications must use:

- Context Isolation
- Secure Preload APIs
- Sandboxed Renderer
- Disabled Node Integration

Never expose:

- File System
- SQLite
- Node APIs

directly to React.

Every IPC message must be validated.

---

# Reminder Rules

Reminder scheduling belongs to:

ReminderService

ReminderService communicates with:

Electron Main

Electron Main displays native notifications.

The renderer never schedules notifications directly.

---

# Heatmap Rules

Heatmap data is generated from completed task history.

Never store heatmap colors.

Never store contribution levels.

Only store completed task timestamps.

The HeatmapService converts historical data into contribution intensity.

---

# Statistics Rules

Statistics are calculated dynamically.

Never store:

- Current Streak
- Longest Streak
- Weekly Totals
- Monthly Totals
- Completion Percentage

Always derive statistics from completed tasks.

---

# Testing Rules

Write tests for:

Repositories

Services

Reminder scheduling

Heatmap generation

Statistics

Recurring task generation

Do not waste time testing simple presentational components.

Business logic is the priority.

---

# Refactoring Rules

When modifying existing code:

Improve readability.

Reduce duplication.

Keep behavior identical.

Never rewrite working code without a clear benefit.

Avoid large refactors while implementing unrelated features.

---

# Code Review Checklist

Before considering any task complete, verify:

✔ TypeScript builds successfully.

✔ ESLint passes.

✔ No console errors.

✔ No duplicated logic.

✔ Existing functionality still works.

✔ Dark mode remains functional.

✔ UI matches the design guidelines.

✔ Architecture rules are respected.

---

# Git Commit Convention

Use Conventional Commits.

Examples:

feat(tasks): implement task creation

feat(reminders): add recurring reminders

fix(calendar): correct date selection

refactor(database): simplify repositories

docs: update architecture

test(heatmap): add contribution tests

Avoid vague commit messages.

---

# Documentation Rules

Every major architectural decision should be reflected in the appropriate documentation.

Do not duplicate documentation across files.

Update documentation when architecture changes.

---

# AI Code Generation Rules

Before writing code:

Read the relevant documentation.

Understand the affected feature.

Reuse existing components.

Plan the implementation.

Only then generate code.

After writing code:

Run static analysis.

Run type checking.

Run linting.

Review your own implementation.

Only then continue.

---

# Forbidden Patterns

Never:

- Use `any`.
- Ignore TypeScript errors.
- Disable ESLint to bypass issues.
- Duplicate code.
- Mix business logic with UI.
- Access SQLite from React.
- Access Electron APIs directly from React.
- Store derived statistics.
- Hardcode configuration values.
- Create global mutable state outside Zustand.
- Add dependencies without necessity.
- Introduce features not described in the PRD.

If unsure, ask for clarification rather than guessing.

---

# Definition of Done

A task is complete only when:

- The feature works as specified.
- TypeScript passes with zero errors.
- ESLint passes.
- No runtime errors occur.
- The architecture remains intact.
- Existing functionality is not broken.
- Code follows AGENTS.md.
- The implementation satisfies the PRD.
- The feature is ready for production use.

"Works on my machine" is not considered done.

---

# Final Principle

TaskFlow values:

Simplicity over complexity.

Consistency over customization.

Maintainability over cleverness.

Performance over unnecessary features.

Every contribution should leave the project easier to understand than before.

