# 🔌 API & IPC Bridge Reference

In Petals, the React renderer process does not have direct access to Node.js or SQLite APIs. All backend operations are exposed via a secure IPC preload bridge accessible through `window.taskflow`.

---

## 📱 Application API (`window.taskflow.app`)

| Method | Return Type | Description |
|---|---|---|
| `version()` | `Promise<string>` | Returns current application version from `package.json` |
| `name()` | `Promise<string>` | Returns application product name (*Petals*) |
| `relaunch()` | `Promise<void>` | Relaunches the desktop application |
| `checkForUpdates()` | `Promise<unknown>` | Triggers check for desktop application updates |
| `openExternal(url: string)` | `Promise<void>` | Opens an external URL in the OS default web browser |

---

## 📋 Task API (`window.taskflow.tasks`)

| Method | Parameters | Return Type | Description |
|---|---|---|---|
| `create(input)` | `TaskCreateInput` | `Promise<Task>` | Creates a new task |
| `getAll()` | None | `Promise<Task[]>` | Fetches all tasks |
| `getById(id)` | `number` | `Promise<Task \| null>` | Fetches a task by primary key |
| `update(id, input)` | `number, TaskUpdateInput` | `Promise<Task>` | Updates an existing task |
| `complete(id)` | `number` | `Promise<Task>` | Toggles or marks task as completed |
| `delete(id)` | `number` | `Promise<boolean>` | Deletes a task |

---

## 🏷️ Category API (`window.taskflow.categories`)

| Method | Parameters | Return Type | Description |
|---|---|---|---|
| `getAll()` | None | `Promise<Category[]>` | Fetches all user task categories |
| `create(input)` | `{ name: string, color: string }` | `Promise<Category>` | Creates a new category |
| `remove(id)` | `number` | `Promise<boolean>` | Removes a category by ID |

---

## 📝 Notepad & Filesystem API (`window.taskflow.notes`)

| Method | Parameters | Return Type | Description |
|---|---|---|---|
| `list()` | None | `Promise<string[]>` | Lists filenames in local notes directory |
| `read(filename)` | `string` | `Promise<string>` | Reads content of a local note file |
| `write(filename, content)` | `string, string` | `Promise<boolean>` | Writes content to a local note file |
| `delete(filename)` | `string` | `Promise<boolean>` | Deletes a local note file |
| `openExternalDialog()` | None | `Promise<{ filePath: string, content: string } \| null>` | Launches OS open file dialog for `.txt` files |
| `readExternal(filePath)` | `string` | `Promise<string>` | Reads content of any external `.txt` file |
| `writeExternal(filePath, content)` | `string, string` | `Promise<boolean>` | Saves content to external `.txt` file |
| `openInExplorer(filePath?)` | `string?` | `Promise<void>` | Opens file or notes directory in Windows File Explorer |

---

## 📊 Analytics & Heatmap API (`window.taskflow.stats` & `window.taskflow.heatmap`)

| Method | Parameters | Return Type | Description |
|---|---|---|---|
| `stats.getOverall()` | None | `Promise<OverallStats>` | Returns overall completion metrics |
| `stats.getDaily(days)` | `number` | `Promise<DailyStats[]>` | Returns daily completions over last N days |
| `stats.getCategory()` | None | `Promise<CategoryStats[]>` | Returns completions grouped by category |
| `stats.getPriority()` | None | `Promise<PriorityStats[]>` | Returns completions grouped by priority |
| `stats.getWeekly()` | None | `Promise<WeeklyStats[]>` | Returns weekly bar chart completion data |
| `stats.getMonthly()` | None | `Promise<MonthlyStats[]>` | Returns monthly trend statistics |
| `heatmap.get(days)` | `number` | `Promise<HeatmapCell[]>` | Returns heatmap contribution grid data |
| `heatmap.getStats(days)` | `number` | `Promise<StreakStats>` | Returns current streak & longest streak |

---

## ⚙️ Settings & Database API (`window.taskflow.settings` & `window.taskflow.db`)

| Method | Parameters | Return Type | Description |
|---|---|---|---|
| `settings.get(key)` | `string` | `Promise<unknown>` | Retrieves setting value by key |
| `settings.set(key, value)`| `string, unknown` | `Promise<boolean>` | Sets setting value |
| `db.getPath()` | None | `Promise<string>` | Returns current `taskflow.db` file path |
| `db.selectPath()` | None | `Promise<string \| null>` | Launches folder picker to choose custom SQLite DB storage path |

---

## 🔔 Notification API (`window.taskflow.notifications`)

| Method | Parameters | Return Type | Description |
|---|---|---|---|
| `show(title, options)` | `string, NotificationOptions?` | `Promise<void>` | Displays a native OS toast notification |
