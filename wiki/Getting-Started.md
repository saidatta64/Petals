# 🚀 Getting Started with Petals

Welcome to **Petals**! This guide walks you through setting up your environment, installing dependencies, launching the development server, and building executable packages.

---

## 📋 System Prerequisites

Before running or building Petals locally, ensure your machine meets the following requirements:

| Component | Minimum Required | Recommended |
|---|---|---|
| **Operating System** | Windows 10/11, macOS 11+, or Ubuntu 20.04+ | Windows 11 (64-bit) |
| **Node.js** | v18.0.0 or higher | v20.x LTS |
| **npm** | v9.0.0 or higher | v10.x |
| **C/C++ Build Tools** | Required for compiling `better-sqlite3` native binaries | Visual Studio Build Tools (Windows) or `build-essential` (Linux) |

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/saidatta64/Petals.git
cd Petals
```

### 2. Install Project Dependencies

Install npm packages across the React renderer and Electron process:

```bash
npm install
```

> [!NOTE]
> `npm install` automatically triggers node-gyp rebuilds for native binaries like `better-sqlite3`. If you encounter native module errors on Windows, refer to the [Troubleshooting & FAQ](Troubleshooting-&-FAQ) guide.

---

## 💻 Running in Development Mode

Petals uses **Vite 5** for lightning-fast HMR (Hot Module Replacement) in the React renderer, and **Electron 27** for the main desktop window runtime.

To start the dev server and launch the desktop application concurrently:

```bash
npm run dev
```

What happens under the hood:
1. `vite` boots up the renderer dev server at `http://localhost:5173`.
2. `wait-on` polls until `http://localhost:5173` is active.
3. `electron .` launches the desktop window loading the Vite HMR URL with full IPC preload access.

---

## ⚙️ Initial Onboarding & Database Path Setup

When launching Petals for the first time:

1. **Welcome Screen**: Enter your display username to personalize your dashboard statistics and greeting.
2. **Database Storage Location**: Select where your `taskflow.db` database will reside on disk.
   - **Default Path**: `AppData/Roaming/Petals/database/taskflow.db`
   - **Custom Location**: Select any local directory (e.g., `D:\Data\Petals\`) to prevent filling up system drive C:.
3. **Automatic Schema Seeding**: The app automatically executes Drizzle ORM migrations and seeds default task categories (*Study*, *Development*, *Production*, *Personal*).

---

## 🏗️ Production Build & Packaging

To compile, bundle, and generate installer binaries for desktop distribution:

### 1. Complete Production Build

```bash
npm run build
```

This single command performs the full packaging sequence:
- `vite build`: Compiles optimized React production bundle into `dist/`.
- `tsc -p tsconfig.node.json`: Compiles Electron main process and preload TypeScript into `dist/electron/`.
- `electron-builder`: Packages the application executable into `release/` (NSIS installer & portable `.exe` on Windows).

### 2. Individual Build Commands

| Script | Purpose |
|---|---|
| `npm run build:renderer` | Compiles only Vite frontend assets |
| `npm run build:electron` | Compiles main process TypeScript |
| `npm run preview` | Previews Vite renderer build locally in browser |
| `npm run type-check` | Runs TypeScript check across renderer and main process |
| `npm run lint` | Runs ESLint across `src/` and `electron/` |

---

## 📁 Packaging Output Artifacts

After running `npm run build`, your production executables are generated in the `release/` folder:

```text
release/
├── Petals Setup 0.2.1.exe      # NSIS Installer for Windows
├── Petals 0.2.1.exe            # Standalone Portable Executable
└── win-unpacked/               # Unpacked application folder
```
