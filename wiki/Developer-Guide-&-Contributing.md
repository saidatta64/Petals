# 🛠️ Developer Guide & Contributing

Thank you for contributing to **Petals**! This guide outlines our coding standards, codebase conventions, feature architecture guidelines, and release procedures.

---

## 🏗️ Feature Modularization Rules

When creating or modifying features in Petals, adhere strictly to our feature-based layout (`src/features/*`):

### Feature Folder Guidelines
1. **Self-Contained Modules**: Every feature (e.g. `src/features/notepad/`, `src/features/tasks/`) should contain its own `components/`, `hooks/`, `services/`, and `types/` subdirectories.
2. **No Cross-Feature Imports**: A feature module must **never** directly import private components or helpers from another feature module.
3. **Shared Utilities**: Common components (e.g., `Modal`, `Button`, `Card`), layout components (`Sidebar`, `Header`), and general hooks belong in `src/shared/`.

---

## 🎨 Code Style & TypeScript Guidelines

- **Strict TypeScript**: Never use `any` unless explicitly handling unknown external IPC payloads. Always define clear interfaces or types.
- **React 19 Hooks**: Use functional components with standard React 19 hooks (`useState`, `useCallback`, `useMemo`).
- **Zustand State Stores**:
  - Keep Zustand stores granular (e.g., `useTaskStore`, `useCategoryStore`, `useNoteStore`).
  - Do NOT invoke raw Electron IPC calls directly from React view components; invoke them inside store actions or dedicated service wrappers.
- **Styling Standards**:
  - Utility-first Tailwind CSS (`tailwind.config.js`).
  - Use **HeroUI** component primitives for modal dialogs, buttons, dropdowns, and inputs to maintain UI consistency.
  - Dark mode support using Tailwind `dark:` classes and custom CSS variable tokens.

---

## 🧪 Verification & Code Quality Commands

Before opening a Pull Request, make sure your code passes all static checks and builds cleanly:

```bash
# 1. Type Check (Renderer + Electron Main Process)
npm run type-check

# 2. Linting (ESLint across src/ and electron/)
npm run lint

# 3. Test Production Build
npm run build
```

---

## 📦 Creating a Release Package

Releases are generated using `electron-builder`.

### Release Workflow

1. Update the version in `package.json` (following Semantic Versioning `MAJOR.MINOR.PATCH`).
2. Run the production build command:
   ```bash
   npm run build
   ```
3. Locate generated setup installers and portable binaries in the `release/` directory:
   - `release/Petals Setup <version>.exe`
   - `release/Petals <version>.exe`
4. Test the packaged installer on a clean target machine before publishing to GitHub Releases.

---

## 🔀 Pull Request Process

1. Fork the repository and create a new feature branch (`git checkout -b feature/amazing-feature`).
2. Commit your changes using descriptive commit messages (`feat: add note search filter`).
3. Push to your fork and submit a Pull Request targeting the `main` branch.
4. Ensure all CI checks, type-checking, and build commands pass.
