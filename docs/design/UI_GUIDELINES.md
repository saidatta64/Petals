# UI_GUIDELINES.md

# TaskFlow UI & UX Guidelines

**Version:** 1.0

---

# Design Philosophy

TaskFlow is designed around one principle:

> **Focus on completing today's work.**

The interface should feel:

* Clean
* Fast
* Calm
* Modern
* Minimal
* Professional

The application should never feel cluttered.

Whitespace is preferred over excessive UI elements.

---

# Design Inspiration

The UI should take inspiration from:

* GitHub Desktop
* VS Code
* Linear
* Notion (simplicity only)
* TickTick
* Todoist
* LeetCode Heatmap
* GitHub Contribution Graph

Do **not** copy any interface exactly.

---

# Design Language

Style

* Arc-inspired Glassy UI
* Heavy use of translucency (backdrop-blur)
* Large Rounded Corners (24px for major containers)
* Minimal, subtle borders
* Soft CSS Variable based Colors
* Smooth micro-animations (Framer Motion)
* No harsh shadows, favor "glass-card" drop shadows

---

# Color Palette (CSS Variables)

The application utilizes a CSS variable-based palette to seamlessly transition between Light and Dark modes.

## Base Variables (`globals.css`)

### Background (`--workspace-bg`)
Light: `#F4F4F5` | Dark: `#09090B`

### Sidebar (`--workspace-sidebar`)
Light: `rgba(255, 255, 255, 0.75)` | Dark: `rgba(18, 18, 20, 0.82)`

### Card / Surface (`--workspace-card`)
Light: `rgba(255, 255, 255, 0.85)` | Dark: `rgba(30, 30, 35, 0.72)`

### Border (`--workspace-border`)
Light: `rgba(0, 0, 0, 0.08)` | Dark: `rgba(255, 255, 255, 0.06)`

### Text (`--workspace-text`)
Light: `#09090B` | Dark: `#FAFAFA`

### Secondary Text (`--workspace-text-secondary`)
Light: `#71717A` | Dark: `#A1A1AA`

---

## Static Brand Colors (Tailwind Config)

* **Primary (Blue):** `#4F8CFF`
* **Purple:** `#7C5CFF`
* **Success (Green):** `#22C55E`
* **Warning (Yellow):** `#FBBF24`
* **Danger (Red):** `#EF4444`

---

# Typography

Font

```text
Inter
```

Fallback

```text
sans-serif
```

Weights

400

500

600

700

Do not use more than four font weights.

---

# Border Radius

Main Layout Containers (Sidebar, Dashboard Grid)

```text
24px (rounded-[24px])
```

Cards & Interactive Panels

```text
16px to 24px
```

Buttons & Standard Inputs

```text
12px (rounded-xl)
```

Dialogs

```text
24px
```

---

# Spacing Scale

Only use:

```text
4

8

12

16

20

24

32

40

48
```

Never invent random spacing values.

---

# Shadows

Very subtle.

Cards

Small shadow only.

Dialogs

Medium shadow.

Never use large shadows.

---

# Icons

Use:

Lucide React

One icon style only.

No mixed icon libraries.

---

# Desktop Layout

```text
┌──────────────────────────────────────────────┐
│ Sidebar │ Top Bar                           │
│         ├────────────────────────────────────┤
│         │                                    │
│         │                                    │
│         │        Current View                │
│         │                                    │
│         │                                    │
│         │                                    │
└──────────────────────────────────────────────┘
```

---

# Sidebar

Width

```text
260px
```

Collapsed

```text
70px
```

Contains

Dashboard

Today's Tasks

Upcoming

Completed

Categories

Calendar

Statistics

Settings

Bottom

Theme Toggle

---

# Top Bar

Contains

Search

Current Page

Quick Add Task Button

Nothing else.

---

# Dashboard Layout

Cards

Today's Tasks

Pending

Completed

Completion %

Current Streak

Longest Streak

Below

Heatmap

Below

Charts

No scrolling unless necessary.

---

# Task Card

Display

Checkbox

Title

Category Badge

Priority Badge

Due Date

Reminder Icon

Completed tasks appear faded.

---

# Priority Colors

High

Red

Medium

Orange

Low

Blue

---

# Category Badge

Rounded pill.

Small.

Background color from category.

---

# Buttons

Primary

Blue

Secondary

Gray

Danger

Red

Never use more than three button styles.

---

# Inputs

Rounded

Clean

No borders thicker than 1px.

---

# Dialogs

Centered.

Background blur.

Maximum width

```text
600px
```

---

# Calendar

Monthly view.

Clicking a day opens tasks for that day.

Completed days display color intensity.

---

# Heatmap

GitHub contribution style.

Each square represents one day.

Color intensity based on completed tasks.

Views

30 Days

90 Days

Year

Hover

Show

Date

Completed Tasks

---

# Charts

Library

Recharts

Charts

Weekly Bar Chart

Monthly Bar Chart

Category Pie Chart

Daily Trend Line

Keep charts simple.

---

# Empty States

When no tasks exist

Show

Simple illustration

Short message

Button

"Create Your First Task"

---

# Loading States

Use skeleton loaders.

Do not use spinners unless absolutely necessary.

---

# Animations

Maximum duration

```text
200ms
```

Only animate

Dialogs

Hover

Sidebar collapse

Task completion

No flashy animations.

---

# Keyboard Shortcuts

Ctrl + N

New Task

Ctrl + F

Search

Ctrl + D

Toggle Dark Mode

Ctrl + ,

Open Settings

Delete

Delete Selected Task

Space

Complete Task

---

# Responsive Behavior

The application is desktop-first.

Minimum supported width

```text
1100px
```

Do not optimize for mobile.

---

# Accessibility

Visible focus indicators.

Keyboard navigation.

ARIA labels.

High contrast support.

Minimum touch target

```text
40px
```

---

# Theme

Support

Light

Dark

System

Remember the selected theme.

---

# Component Library

Shared components

Button

Input

Modal

Card

Badge

Checkbox

Dropdown

Tooltip

Calendar

Chart

Heatmap

Sidebar

TopBar

Never duplicate components.

---

# UI Principles

Every screen should answer these questions immediately:

* What should I do today?
* What is overdue?
* What have I completed?
* Am I staying consistent?

If a UI element does not help answer one of these questions, it probably does not belong in the MVP.

---

# Visual Hierarchy

1. Today's work
2. Pending work
3. Completion progress
4. Heatmap
5. Statistics
6. Historical data

The user should always know what to do next within a few seconds of opening the application.

---

# Final Design Rules

* Keep the interface uncluttered.
* Use whitespace generously.
* Favor readability over decoration.
* Reuse components wherever possible.
* Keep interactions predictable.
* Make task completion require the fewest possible clicks.
* Maintain visual consistency across all screens.
