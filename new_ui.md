# Arc Browser Inspired UI Redesign Prompt

## Role

You are a Senior Product Designer and Frontend Engineer responsible for transforming my Todo application into a premium productivity experience.

Your mission is **NOT** to redesign it as another SaaS dashboard.

Instead, redesign it as if it were created by the teams behind **Arc Browser**, **Linear**, **Notion Calendar**, **Superlist**, and **Apple**.

The application should feel like a modern desktop application rather than a CRUD website.

---

# Tech Stack

The project already uses:

- HeroUI
- TailwindCSS
- Framer Motion
- React
- Lucide React

Use HeroUI components whenever possible instead of building custom UI.

Do not replace HeroUI with another component library.

---

# Design Philosophy

The interface should feel

- Calm
- Elegant
- Spacious
- Premium
- Modern
- Minimal
- Intelligent

Every element should have a purpose.

Avoid unnecessary decorations.

Avoid dashboard templates.

Avoid Bootstrap aesthetics.

The design should emphasize clarity and focus.

---

# Inspiration

Primary Inspirations

- Arc Browser
- Linear
- Superlist
- Notion Calendar
- Raycast
- Craft Docs
- Apple Human Interface Guidelines

Avoid inspiration from

- Bootstrap Admin Dashboards
- CRM Templates
- Analytics Dashboards
- Generic SaaS Landing Pages

---

# Overall Layout

Replace the traditional dashboard with a workspace.

The application should feel centered around today's work.

Example layout

```
╭────────────────────────────────────────────────────────────────────╮
│ Sidebar                                                   Search  │
│                                                                ⚙ │
├────────────────────────────────────────────────────────────────────┤

               Good Evening 👋

      Ready to finish today's goals?

────────────────────────────────────────────────────────────────────

Today's Focus

☐ Build Todo Application

☐ Solve Leetcode

☑ Workout

☐ ML Club Project

────────────────────────────────────────────────────────────────────

Upcoming

Tomorrow

Friday

Next Week

────────────────────────────────────────────────────────────────────

Recent Activity

GitHub Style Heatmap

Pomodoro

Current Streak

```

The application should prioritize tasks rather than analytics.

---

# Sidebar

The sidebar should be inspired by Arc Browser.

Requirements

- Floating
- Rounded corners
- Glass effect
- Soft blur
- Soft shadow
- Smooth animations
- Collapsible
- Spring motion

Navigation items

- Dashboard
- Today
- Upcoming
- Calendar
- Categories
- Statistics
- Completed
- Settings

Selected navigation

- Blue glowing pill
- Smooth animation
- Rounded background

Hover state

- Slight lift
- Icon scaling
- Background fade

Bottom area

- User Avatar
- Theme Toggle
- Settings
- Storage Usage
- Logout

---

# Window Layout

The content should never stretch edge to edge.

Maximum Width

1600px

Large padding

Rounded corners

Floating workspace

Shadow

Glass appearance

---

# Background

Do not use flat colors.

Create layered gradients.

Background should include

- Deep charcoal
- Blue radial glow
- Purple accent glow
- Soft vignette
- Noise texture

The interface should feel alive.

---

# Header

Minimal.

Contains only

- Search
- Notifications
- Theme Toggle
- Command Palette
- Profile Avatar

No oversized navigation bar.

---

# Hero Section

Instead of statistics cards create a motivational section.

Example

Good Evening, Saidatta 👋

You have 5 tasks today.

Complete 2 more to keep your 14-day streak alive.

Buttons

- New Task
- Start Focus Session

---

# Dashboard

The Dashboard should become a productivity workspace.

Include

- Today's Focus
- Upcoming Tasks
- Recent Activity
- Current Streak
- GitHub Style Heatmap
- Weekly Goal
- Pomodoro Timer
- Productivity Score
- Smart Suggestions

Remove giant empty cards.

Every section must have purpose.

---

# Task Cards

Tasks should become the primary visual element.

Each card should contain

- Checkbox
- Title
- Description
- Priority Badge
- Category Chip
- Due Date
- Estimated Duration
- Progress Bar
- Subtasks
- Tags
- Attachments
- Hover Actions

Hover Actions

- Complete
- Edit
- Delete
- Duplicate
- Archive

Cards should animate smoothly.

Hover

- Lift
- Glow
- Scale

---

# Calendar

The calendar should feel modern.

Requirements

- Rounded
- Glass effect
- Floating card
- Task indicators
- Hover preview
- Drag and Drop
- Animated transitions

---

# Productivity Widgets

Instead of large empty charts create compact widgets.

Widgets

- Pomodoro Timer
- Current Streak
- Productivity Score
- GitHub Contribution Heatmap
- Upcoming Deadlines
- Weekly Progress
- Recent Activity Timeline
- Smart Suggestions
- Daily Quote

Each widget should occupy only the space it needs.

---

# Charts

Use Recharts.

Charts

- Weekly Completion
- Monthly Progress
- Category Distribution
- Productivity Trend
- GitHub Heatmap

Charts should

- Animate
- Use gradients
- Have rounded corners
- Support dark mode

---

# HeroUI Components

Use HeroUI wherever possible.

Required components

- Button
- Card
- Input
- Chip
- Badge
- Avatar
- Modal
- Drawer
- Tooltip
- Dropdown
- Calendar
- Popover
- Tabs
- Progress
- Circular Progress
- Skeleton
- Toast
- Divider
- Accordion

Avoid recreating these components manually.

---

# Animations

Use Framer Motion extensively.

Animations

- Sidebar slide
- Card lift
- Hover glow
- Button scale
- Page transitions
- Shared layout animations
- Smooth drag animations
- Progress animations
- Checkbox animations

Every interaction should feel smooth.

Nothing should instantly appear.

---

# Typography

Use

- Inter
- SF Pro Display

Hierarchy

Large heading

Medium section titles

Muted secondary text

Comfortable spacing

Readable line height

---

# Color Palette

Background

```
#09090B
```

Sidebar

```
rgba(18,18,20,0.82)
```

Cards

```
rgba(30,30,35,0.72)
```

Borders

```
rgba(255,255,255,0.06)
```

Primary Blue

```
#4F8CFF
```

Purple

```
#7C5CFF
```

Green

```
#22C55E
```

Yellow

```
#FBBF24
```

Red

```
#EF4444
```

Primary Text

```
#FAFAFA
```

Secondary Text

```
#A1A1AA
```

---

# Empty States

Never leave blank containers.

Instead show

- Illustration
- Helpful message
- Primary CTA

Example

```
🎉 No tasks today.

Enjoy your evening.

[ Create New Task ]
```

---

# Mobile Experience

Responsive.

Tablet friendly.

Mobile should have

- Bottom Navigation
- Floating Add Button
- Gesture Friendly Cards
- Optimized Calendar
- Smooth Animations

---

# Accessibility

Follow WCAG guidelines.

Support

- Keyboard Navigation
- Screen Readers
- Focus States
- Proper Contrast
- Semantic HTML

---

# Code Quality

Requirements

- Reusable components
- Clean folder structure
- Modular architecture
- Consistent Tailwind utilities
- HeroUI-first implementation
- Optimized rendering
- Minimal unnecessary re-renders

---

# Final Goal

The finished application should **not resemble a dashboard**.

Instead, it should feel like a premium desktop productivity workspace inspired by Arc Browser.

Users should immediately feel calm, focused, and motivated to complete their work.

Every page should share the same design language.

Every interaction should feel smooth.

Every animation should feel intentional.

Every screen should feel handcrafted.

The application should look polished enough that it could be showcased as a modern SaaS product on platforms like Dribbble, Awwwards, or Layers.